/**
 * Extracts the YouTube video ID from a given URL or returns the input if it's already a valid video ID.
 */
export function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.slice(8).split("/")[0] ?? null;
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.slice(7).split("/")[0] ?? null;
      }
    }
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }
    return null;
  } catch {
    // Fallback to testing if the input itself is a video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    return null;
  }
}
