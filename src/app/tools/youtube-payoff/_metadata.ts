import { type ToolMeta } from "../types";

export const metadata: ToolMeta = {
  route: "/youtube-payoff",
  title: "YouTube Payoff",
  short_description:
    "Save a bunch of time and just paste a YouTube URL in to find out if the video delivers on its clickbait title and thumbnail.",
  description: `Paste a YouTube URL and find out if the video actually delivers on its title and thumbnail through an LLM analysis of the video's transcript, title and thumbnail. 
  You'll get insights on the  **clickbait payoff**, and break down the key points so you don't have to watch the whole thing.`,
  image: "/tools/youtube-payoff.gif",
};
