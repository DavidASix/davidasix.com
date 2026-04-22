import { describe, expect, it } from "vitest";
import { extractVideoId } from "./youtube-payoff";

describe("extractVideoId", () => {
  describe("youtube.com/watch URLs", () => {
    it("extracts video ID from standard watch URL", () => {
      expect(
        extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
      ).toBe("dQw4w9WgXcQ");
    });

    it("extracts video ID from watch URL without www", () => {
      expect(extractVideoId("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "dQw4w9WgXcQ",
      );
    });

    it("extracts video ID from mobile watch URL", () => {
      expect(extractVideoId("https://m.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "dQw4w9WgXcQ",
      );
    });

    it("extracts video ID from watch URL with extra params", () => {
      expect(
        extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s"),
      ).toBe("dQw4w9WgXcQ");
    });

    it("extracts video ID from watch URL with param before v", () => {
      expect(
        extractVideoId(
          "https://www.youtube.com/watch?list=PLxyz&t=42s&v=dQw4w9WgXcQ",
        ),
      ).toBe("dQw4w9WgXcQ");
    });

    it("returns null when v param is missing", () => {
      expect(
        extractVideoId("https://www.youtube.com/watch?list=PLxyz"),
      ).toBeNull();
    });
  });

  describe("youtube.com/shorts URLs", () => {
    it("extracts video ID from shorts URL", () => {
      expect(extractVideoId("https://www.youtube.com/shorts/abc123XYZ")).toBe(
        "abc123XYZ",
      );
    });

    it("extracts video ID from shorts URL without www", () => {
      expect(extractVideoId("https://youtube.com/shorts/abc123XYZ")).toBe(
        "abc123XYZ",
      );
    });
  });

  describe("youtube.com/embed URLs", () => {
    it("extracts video ID from embed URL", () => {
      expect(extractVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
        "dQw4w9WgXcQ",
      );
    });

    it("extracts video ID from embed URL with query params", () => {
      expect(
        extractVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"),
      ).toBe("dQw4w9WgXcQ");
    });
  });

  describe("youtu.be URLs", () => {
    it("extracts video ID from youtu.be short URL", () => {
      expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe(
        "dQw4w9WgXcQ",
      );
    });

    it("extracts video ID from youtu.be URL with query params", () => {
      expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ?t=42")).toBe(
        "dQw4w9WgXcQ",
      );
    });
  });

  describe("http scheme", () => {
    it("works with http youtube.com", () => {
      expect(extractVideoId("http://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "dQw4w9WgXcQ",
      );
    });

    it("works with http youtu.be", () => {
      expect(extractVideoId("http://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });
  });

  describe("invalid URLs", () => {
    it("returns null for non-YouTube URLs", () => {
      expect(extractVideoId("https://vimeo.com/123456")).toBeNull();
    });

    it("returns null for google.com", () => {
      expect(extractVideoId("https://google.com")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(extractVideoId("")).toBeNull();
    });

    it("returns null for not-a-url", () => {
      expect(extractVideoId("just some text")).toBeNull();
    });

    it("returns the ID if input is a bare 11-character video ID", () => {
      expect(extractVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("returns the ID for bare video ID with underscores and hyphens", () => {
      expect(extractVideoId("abc_DEF-123")).toBe("abc_DEF-123");
    });

    it("returns null for string that is too short to be a video ID", () => {
      expect(extractVideoId("abc123")).toBeNull();
    });

    it("returns null for string that is too long to be a video ID", () => {
      expect(extractVideoId("dQw4w9WgXcQextra")).toBeNull();
    });

    it("returns null for youtube.com with unrecognized path", () => {
      expect(
        extractVideoId("https://www.youtube.com/feed/trending"),
      ).toBeNull();
    });

    it("returns null for youtube.com root", () => {
      expect(extractVideoId("https://www.youtube.com/")).toBeNull();
    });
  });
});
