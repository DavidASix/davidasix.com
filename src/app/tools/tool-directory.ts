import { metadata as investment } from "./investment/_metadata";
import { metadata as retirement } from "./retirement/_metadata";
import { type ToolMeta } from "./types";

export type { ToolMeta };

export const toolDirectory: ToolMeta[] = [retirement, investment];
