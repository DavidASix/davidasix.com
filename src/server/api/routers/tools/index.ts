import { createTRPCRouter } from "~/server/api/trpc";
import { youtubePayoffRouter } from "./youtube-payoff";

export const toolsRouter = createTRPCRouter({
  youtubePayoff: youtubePayoffRouter,
});
