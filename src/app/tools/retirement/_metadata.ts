import { type ToolMeta } from "../types";

export const metadata: ToolMeta = {
  route: "/retirement",
  title: "RRIF Calculator",
  short_description:
    "Nobody wants to worry about money when they're old, but getting to that point requires a lot of planning. In my retirement planning journey I found a bunch of RRIF calculators but none that gave me a full picture of how much money I'd need in order to retire.",
  description: `Nobody wants to worry about money when they're old, but getting to that point requires a lot of planning. In my retirement planning journey I found a bunch of RRIF calculators but none that gave me a full picture of how much money I'd need in order to retire.

This one builds in **federal and provincial income tax**, **CPP**, and **OAS**, giving you a full view of how much money you realistically need to retire at a given income.

Is it 100% accurate? I don't know. But I'm not retiring tomorrow so it gives a good enough estimate for now.`,
  image: "/tools/retirement.gif",
};
