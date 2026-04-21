import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { YoutubeTranscript } from "youtube-transcript";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";

const MAX_TRANSCRIPT_WORDS = 6000;

const systemPrompt = [
  "You are a concise video analyst. Given a YouTube video title and transcript, produce a JSON object with exactly these fields:\n",
  '- "short_summary": A 2-3 sentence plain-text summary of the video content.',
  '- "payoff": A markdown-formatted analysis of whether the video\'s title and thumbnail deliver on their promise. Explain what clickbait elements exist (if any) and whether the content justifies them.',
  '- "structure": A markdown-formatted breakdown of the video\'s key points. If the video lists steps, bullet points, or numbered items, reproduce them concisely.',
].join("\n");

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com"
    ) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.slice(8);
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.slice(7);
      }
    }
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }
    return null;
  } catch {
    return null;
  }
}

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
  analyze: publicProcedure
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

      let transcriptText: string | null = null;
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        transcriptText = transcript.map((t) => t.text).join(" ");
      } catch {
        console.error("Failed to fetch transcript for video ID:", videoId);
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
