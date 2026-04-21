import { describe, expect, it, vi } from "vitest";
import { initTRPC } from "@trpc/server";
import { passkeyProcedure } from "~/server/api/trpc";
import { encrypt } from "~/lib/server-crypto";

vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "test",
    PASSKEY: "test-passkey-value-16ch",
    PASSKEY_ENCRYPTION_KEY: "test-encryption-key",
  },
}));

const t = initTRPC.create();

describe("passkeyProcedure", () => {
  const router = t.router({
    test: passkeyProcedure.mutation(({ input }) => input),
  });
  const caller = t.createCallerFactory(router)({});

  it("allows access with a valid encrypted passkey", async () => {
    const encrypted = encrypt("test-passkey-value-16ch", "test-encryption-key");
    const result = await caller.test({ passkey: encrypted });
    expect(result.passkey).toBe(encrypted);
  });

  it("rejects access with an encrypted wrong passkey", async () => {
    const encrypted = encrypt("wrong-passkey", "test-encryption-key");
    await expect(caller.test({ passkey: encrypted })).rejects.toThrow(
      "Invalid passkey",
    );
  });

  it("rejects access with garbage input", async () => {
    await expect(
      caller.test({ passkey: "garbage-not-encrypted" }),
    ).rejects.toThrow("Invalid passkey");
  });

  it("rejects access with empty passkey", async () => {
    await expect(caller.test({ passkey: "" })).rejects.toThrow();
  });

  it("rejects access encrypted with wrong encryption key", async () => {
    const encrypted = encrypt(
      "test-passkey-value-16ch",
      "wrong-encryption-key",
    );
    await expect(caller.test({ passkey: encrypted })).rejects.toThrow(
      "Invalid passkey",
    );
  });
});
