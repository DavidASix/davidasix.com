import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { encrypt } from "~/lib/server-crypto";
import { env } from "~/env";
import { youtubePayoffRouter } from "./youtube-payoff";

export const toolsRouter = createTRPCRouter({
  /**
   * Returns an encrypted version of the provided passkey, whether it was an accurate passkey or not
   */
  encryptPasskey: publicProcedure
    .input(z.object({ passkey: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // Super simple rate limit: 1 request per 500ms, to make brute forcing more difficult
      // Also rate limited at the host level
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { encrypted: encrypt(input.passkey, env.PASSKEY_ENCRYPTION_KEY) };
    }),
  youtubePayoff: youtubePayoffRouter,
});
