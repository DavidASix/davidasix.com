import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, passkeyProcedure } from "~/server/api/trpc";
import {
  fetchTranscript,
  TranscriptFetchError,
} from "~/lib/youtube-transcript";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { eq } from "drizzle-orm";

import { db } from "~/db";
import { youtubeVideos } from "~/db/schema";
import { extractVideoId } from "~/lib/youtube-payoff";

const MAX_TRANSCRIPT_WORDS = 6000;

type YoutubeVideo = typeof youtubeVideos.$inferSelect;
type NewYoutubeVideo = typeof youtubeVideos.$inferInsert;

async function saveVideo(video: NewYoutubeVideo): Promise<YoutubeVideo> {
  const [insertedVideo] = await db
    .insert(youtubeVideos)
    .values(video)
    .onConflictDoNothing({ target: youtubeVideos.videoId })
    .returning();

  if (insertedVideo) return insertedVideo;

  const [existingVideo] = await db
    .select()
    .from(youtubeVideos)
    .where(eq(youtubeVideos.videoId, video.videoId))
    .limit(1);

  if (existingVideo) return existingVideo;

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to save video analysis",
  });
}

const systemPrompt = [
  "You are a critical video analyst. You are tired of click-bait videos and you're responsible for saving users from wasting their precious time. Take an aggressive and very critical but fair approach when analyzing Youtube videos.",
  "You will receive two clearly labeled sections: The Promise and The Content.",
  "The Promise contains the expectation created by the video's title and thumbnail. The Content contains the video's transcript.",
  "Compare the two and produce a JSON object with exactly these fields:\n",
  '- "short_summary": A 2-3 sentence plain-text summary based only on The Content.',
  '- "analysis": A markdown-formatted analysis of whether The Content delivers The Promise. Begin with one of these clear verdicts: "Not Clickbait" "Clickbaity" or "Clickbait". Then provide a 1 sentence clarified promise for the video, this should essentially function the same as a new title. Next provide an analysis, in your analysis describe which promises were or were not fulfilled, citing relevant details from the title, thumbnail, and content. Identify clickbait or misleading framing when present. Break this down into sections, and keep your prose short, concise, clear and decisive.',
  '- "structure": A markdown-formatted breakdown of the key points in The Content. If the video lists steps, bullet points, or numbered items, reproduce them concisely.',
].join("\n");

const oEmbedResponseSchema = z.object({
  title: z.string(),
  author_name: z.string(),
  thumbnail_url: z.string().url(),
});

type OEmbedResponse = z.infer<typeof oEmbedResponseSchema>;

const analysisSchema = z.object({
  short_summary: z.string(),
  analysis: z.string(),
  structure: z.string(),
});

const thumbnailAnalysisSchema = z.object({
  description: z.string(),
  text: z.string(),
});

const promiseSchema = z.object({
  promise: z.string(),
});

export const youtubePayoffRouter = createTRPCRouter({
  analyze: passkeyProcedure
    .input(
      z.object({
        url: z.string().min(11, "Please enter a YouTube URL or video ID"),
      }),
    )
    .mutation(async ({ input }): Promise<YoutubeVideo> => {
      const videoId = extractVideoId(input.url);
      if (!videoId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter a valid YouTube URL",
        });
      }

      const [existingVideo] = await db
        .select()
        .from(youtubeVideos)
        .where(eq(youtubeVideos.videoId, videoId))
        .limit(1);

      if (existingVideo) return existingVideo;

      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      let oEmbed: OEmbedResponse;
      try {
        const res = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`,
        );
        if (!res.ok) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Video not found or unavailable",
          });
        }
        const data: unknown = await res.json();
        const parsed = oEmbedResponseSchema.safeParse(data);
        if (!parsed.success) {
          console.error("oEmbed response validation failed:", parsed.error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve video metadata",
          });
        }
        oEmbed = parsed.data;
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found or unavailable",
        });
      }

      let thumbnailAnalysis: z.infer<typeof thumbnailAnalysisSchema>;
      try {
        const { output } = await generateText({
          model: openai("gpt-5.4-mini"),
          output: Output.object({ schema: thumbnailAnalysisSchema }),
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: [
                    "Analyze this YouTube thumbnail.",
                    "Describe the people, objects, setting, actions, and other notable visual elements shown.",
                    'Transcribe all visible text exactly in the "text" field. If there is no visible text, return an empty string.',
                  ].join(" "),
                },
                {
                  type: "image",
                  image: new URL(oEmbed.thumbnail_url),
                },
              ],
            },
          ],
        });
        thumbnailAnalysis = output;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze video thumbnail. Please try again.",
        });
      }

      let videoPromise: string;
      try {
        const { output } = await generateText({
          model: openai("gpt-5.4-mini"),
          output: Output.object({ schema: promiseSchema }),
          system: [
            "Determine the promise a YouTube video makes to its viewer using only its title and thumbnail analysis.",
            "Describe what outcome, revelation, answer, or experience the packaging implies the viewer will receive.",
            "Be specific and concise. Respond with no more than three sentences.",
          ].join(" "),
          prompt: [
            `Video title: ${oEmbed.title}`,
            `Thumbnail description: ${thumbnailAnalysis.description}`,
            `Text visible in thumbnail: ${thumbnailAnalysis.text || "(none)"}`,
          ].join("\n"),
        });
        videoPromise = output.promise;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to determine the video promise. Please try again.",
        });
      }

      let transcriptText = "";
      try {
        const transcript = await fetchTranscript(videoId);
        transcriptText = transcript.map((t) => String(t.text)).join(" ");
      } catch (e) {
        if (e instanceof TranscriptFetchError) {
          console.error(
            "Transcript unavailable for video ID:",
            videoId,
            e.message,
          );
          return saveVideo({
            videoId,
            title: oEmbed.title,
            author: oEmbed.author_name,
            url: videoUrl,
            thumbnailUrl: oEmbed.thumbnail_url,
            thumbnailAnalysis: thumbnailAnalysis.description,
            thumbnailText: thumbnailAnalysis.text,
            promise: videoPromise,
            transcriptUnavailable: true,
          });
        }
        console.error(
          "Unexpected error fetching transcript for video ID:",
          videoId,
          e,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch transcript. Please try again.",
        });
      }

      const wordCount = transcriptText.split(/\s+/).length;
      if (wordCount > MAX_TRANSCRIPT_WORDS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Transcript is too long. Maximum is 6,000 words (~30 minute video).",
        });
      }

      try {
        const { output } = await generateText({
          model: openai("gpt-5.4-mini"),
          output: Output.object({ schema: analysisSchema }),
          system: systemPrompt,
          prompt: [
            "## The Promise",
            `Promise: ${videoPromise}`,
            `Video title: ${oEmbed.title}`,
            `Thumbnail description: ${thumbnailAnalysis.description}`,
            `Text visible in thumbnail: ${thumbnailAnalysis.text || "(none)"}`,
            "",
            "## The Content",
            transcriptText,
          ].join("\n"),
        });

        return saveVideo({
          videoId,
          title: oEmbed.title,
          author: oEmbed.author_name,
          url: videoUrl,
          thumbnailUrl: oEmbed.thumbnail_url,
          shortSummary: output.short_summary,
          analysis: output.analysis,
          structure: output.structure,
          transcript: transcriptText,
          thumbnailAnalysis: thumbnailAnalysis.description,
          thumbnailText: thumbnailAnalysis.text,
          promise: videoPromise,
          transcriptUnavailable: false,
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze video. Please try again.",
        });
      }
    }),
});
