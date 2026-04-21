import { metadata as investment } from "./investment/_metadata";
import { metadata as retirement } from "./retirement/_metadata";
import { metadata as youtubePayoff } from "./youtube-payoff/_metadata";
import { type ToolMeta } from "./types";

export type { ToolMeta };

export const toolDirectory: ToolMeta[] = [
  youtubePayoff,
  retirement,
  investment,
];
