import { z } from "zod";
import { env } from "~/env";

const RAPIDAPI_HOST = "youtube-transcript3.p.rapidapi.com";

const rapidApiResponseSchema = z.object({
  success: z.boolean(),
  transcript: z.array(
    z.object({
      text: z.string().or(z.number()).or(z.boolean()),
      duration: z.string(),
      offset: z.string(),
      lang: z.string(),
    }),
  ),
});

type RapidApiTranscript = Pick<
  z.infer<typeof rapidApiResponseSchema.shape.transcript>[number],
  "text" | "duration" | "offset"
>[];

export class TranscriptFetchError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function fetchTranscript(
  videoId: string,
): Promise<RapidApiTranscript> {
  const url = `https://${RAPIDAPI_HOST}/api/transcript?videoId=${videoId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": env.RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new TranscriptFetchError(
      `Failed to fetch transcript for video ${videoId} (HTTP ${res.status})`,
    );
  }

  const raw: unknown = await res.json();

  const parsed = rapidApiResponseSchema.safeParse(raw);

  if (!parsed.success) {
    throw new TranscriptFetchError(
      `Unexpected response format when fetching transcript for video ${videoId}`,
    );
  }

  if (!parsed.data.success || parsed.data.transcript.length === 0) {
    throw new TranscriptFetchError(
      `Transcript is disabled on this video (${videoId})`,
    );
  }

  return parsed.data.transcript.map(({ text, duration, offset }) => ({
    text,
    duration,
    offset,
  }));
}
