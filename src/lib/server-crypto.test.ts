import { describe, expect, it } from "vitest";
import { encrypt, decrypt } from "./server-crypto";

describe("server-crypto", () => {
  const secret = "test-encryption-secret-key";

  describe("encrypt/decrypt roundtrip", () => {
    it("roundtrips a simple string", () => {
      const encrypted = encrypt("hello world", secret);
      const decrypted = decrypt(encrypted, secret);
      expect(decrypted).toBe("hello world");
    });

    it("roundtrips an empty string", () => {
      const encrypted = encrypt("", secret);
      const decrypted = decrypt(encrypted, secret);
      expect(decrypted).toBe("");
    });

    it("roundtrips unicode characters", () => {
      const text = "日本語テスト 🎉 émojis";
      const encrypted = encrypt(text, secret);
      const decrypted = decrypt(encrypted, secret);
      expect(decrypted).toBe(text);
    });

    it("roundtrips a very long string", () => {
      const text = "a".repeat(10_000);
      const encrypted = encrypt(text, secret);
      const decrypted = decrypt(encrypted, secret);
      expect(decrypted).toBe(text);
    });

    it("produces different ciphertext each time due to random IV", () => {
      const enc1 = encrypt("same input", secret);
      const enc2 = encrypt("same input", secret);
      expect(enc1).not.toBe(enc2);
      expect(decrypt(enc1, secret)).toBe("same input");
      expect(decrypt(enc2, secret)).toBe("same input");
    });
  });

  describe("decrypt with wrong secret", () => {
    it("returns null when decrypted with a different secret", () => {
      const encrypted = encrypt("secret message", secret);
      const decrypted = decrypt(encrypted, "wrong-secret");
      expect(decrypted).toBeNull();
    });
  });

  describe("decrypt with tampered ciphertext", () => {
    it("returns null for garbage input", () => {
      expect(decrypt("not-base64!!!", secret)).toBeNull();
    });

    it("returns null for truncated base64", () => {
      const encrypted = encrypt("some text", secret);
      const truncated = encrypted.slice(0, encrypted.length - 10);
      expect(decrypt(truncated, secret)).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(decrypt("", secret)).toBeNull();
    });

    it("returns null for modified base64", () => {
      const encrypted = encrypt("some text", secret);
      const bytes = Buffer.from(encrypted, "base64");
      const last = bytes[bytes.length - 1];
      bytes[bytes.length - 1] = (last ?? 0) ^ 0xff;
      expect(decrypt(bytes.toString("base64"), secret)).toBeNull();
    });
  });
});
