const INNERTUBE_ENDPOINT =
  "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)";

const CLIENT_CONTEXTS = [
  {
    client: {
      clientName: "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
      clientVersion: "2.0",
      clientScreen: "EMBED",
    },
    thirdParty: {
      embedUrl: "https://www.google.com",
    },
  },
  {
    client: {
      clientName: "WEB_EMBEDDED_PLAYER",
      clientVersion: "1.20240723.00.00",
      clientScreen: "EMBED",
    },
    thirdParty: {
      embedUrl: "https://www.google.com",
    },
  },
  {
    client: {
      clientName: "ANDROID",
      clientVersion: "20.10.38",
    },
  },
] as const;

const HTML_ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_match, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_match, dec: string) =>
      String.fromCodePoint(parseInt(dec, 10)),
    )
    .replace(
      /&(?:amp|lt|gt|quot|apos|#39);/g,
      (entity) => HTML_ENTITY_MAP[entity] ?? entity,
    );
}

function parseTranscriptXml(
  xml: string,
): { text: string; duration: number; offset: number }[] {
  const results: { text: string; duration: number; offset: number }[] = [];
  const srv3Regex = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;
  let match: RegExpExecArray | null;

  while ((match = srv3Regex.exec(xml)) !== null) {
    const offset = parseInt(match[1]!, 10);
    const duration = parseInt(match[2]!, 10);
    const raw = match[3] ?? "";
    let text = "";
    const segRegex = /<s[^>]*>([^<]*)<\/s>/g;
    let segMatch: RegExpExecArray | null;
    while ((segMatch = segRegex.exec(raw)) !== null) {
      text += segMatch[1] ?? "";
    }
    if (!text) {
      text = raw.replace(/<[^>]+>/g, "");
    }
    text = decodeEntities(text).trim();
    if (text) {
      results.push({ text, duration, offset });
    }
  }

  if (results.length > 0) return results;

  const classicRegex = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;
  while ((match = classicRegex.exec(xml)) !== null) {
    const t = decodeEntities(match[3]!).trim();
    if (t) {
      results.push({
        text: t,
        duration: parseFloat(match[2]!),
        offset: parseFloat(match[1]!),
      });
    }
  }

  return results;
}

export class TranscriptFetchError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function fetchTranscript(
  videoId: string,
  customFetch: typeof globalThis.fetch = fetch,
): Promise<{ text: string; duration: number; offset: number }[]> {
  for (const context of CLIENT_CONTEXTS) {
    try {
      const res = await customFetch(INNERTUBE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": BROWSER_USER_AGENT,
        },
        body: JSON.stringify({
          context,
          videoId,
        }),
      });

      if (!res.ok) continue;

      const data = (await res.json()) as Record<string, unknown>;
      const captions = data?.captions as
        | { playerCaptionsTracklistRenderer?: { captionTracks?: unknown[] } }
        | undefined;
      const tracks = captions?.playerCaptionsTracklistRenderer?.captionTracks;

      if (!Array.isArray(tracks) || tracks.length === 0) continue;

      const track = tracks[0] as { baseUrl?: string; languageCode?: string };
      const baseUrl = track.baseUrl;
      if (!baseUrl || typeof baseUrl !== "string") continue;

      try {
        if (!new URL(baseUrl).hostname.endsWith(".youtube.com")) continue;
      } catch {
        continue;
      }

      const transcriptRes = await customFetch(baseUrl, {
        headers: { "User-Agent": BROWSER_USER_AGENT },
      });
      if (!transcriptRes.ok) continue;

      const xml = await transcriptRes.text();
      const parsed = parseTranscriptXml(xml);
      if (parsed.length > 0) return parsed;
    } catch {
      continue;
    }
  }

  throw new TranscriptFetchError(
    `Transcript is disabled on this video (${videoId})`,
  );
}
