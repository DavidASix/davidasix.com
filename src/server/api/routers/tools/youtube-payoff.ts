import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, passkeyProcedure } from "~/server/api/trpc";
import { YoutubeTranscript, YoutubeTranscriptError } from "youtube-transcript";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { extractVideoId } from "~/lib/youtube-payoff";

const MAX_TRANSCRIPT_WORDS = 6000;

const systemPrompt = [
  "You are a concise video analyst. Given a YouTube video title and transcript, produce a JSON object with exactly these fields:\n",
  '- "short_summary": A 2-3 sentence plain-text summary of the video content.',
  '- "payoff": A markdown-formatted analysis of whether the video\'s title and thumbnail deliver on their promise. Explain what clickbait elements exist (if any) and whether the content justifies them.',
  '- "structure": A markdown-formatted breakdown of the video\'s key points. If the video lists steps, bullet points, or numbered items, reproduce them concisely.',
].join("\n");

const oEmbedResponseSchema = z.object({
  title: z.string(),
  author_name: z.string(),
  thumbnail_url: z.string().url(),
});

type OEmbedResponse = z.infer<typeof oEmbedResponseSchema>;

const analysisSchema = z.object({
  short_summary: z.string(),
  payoff: z.string(),
  structure: z.string(),
});

export const youtubePayoffRouter = createTRPCRouter({
  analyze: passkeyProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const videoId = extractVideoId(input.url);
      if (!videoId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter a valid YouTube URL",
        });
      }

      let oEmbed: OEmbedResponse;
      try {
        const res = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(input.url)}&format=json`,
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

      let transcriptText = "";
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        transcriptText = transcript.map((t) => t.text).join(" ");
      } catch (e) {
        if (e instanceof YoutubeTranscriptError) {
          console.error(
            "Transcript unavailable for video ID:",
            videoId,
            e.message,
          );
          return {
            title: oEmbed.title,
            author: oEmbed.author_name,
            link: input.url,
            thumbnail_url: oEmbed.thumbnail_url,
            short_summary: "",
            payoff: "",
            structure: "",
            transcript_unavailable: true,
          };
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
          prompt: `Video title: ${oEmbed.title}\nVideo transcript: ${transcriptText}`,
        });

        return {
          title: oEmbed.title,
          author: oEmbed.author_name,
          link: input.url,
          thumbnail_url: oEmbed.thumbnail_url,
          short_summary: output.short_summary,
          payoff: output.payoff,
          structure: output.structure,
          transcript_unavailable: false,
        };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze video. Please try again.",
        });
      }
    }),
});
