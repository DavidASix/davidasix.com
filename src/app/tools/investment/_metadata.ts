import { type ToolMeta } from "../types";

export const metadata: ToolMeta = {
  route: "/investment",
  title: "Investment Calculator",
  short_description: "OK so you used the RRIF calculator and you know how much money you need to retire, but how are you going to make that much??",
  description: `OK so you used the RRIF calculator and you know how much money you need to retire, but how are you going to make that much?? This (simple) investment calculator helps you figure it out.
The math is pretty simplified in this tool, but a unique feature is it allows you to add in timed lump sum contributions (like, in 60 years I'll get a $10,000 inheritance, how does that affect my situation?).
Model **regular contributions**, **lump sums**, and a **rate of return** to project your portfolio over time.`,
  image: "/tools/investment.gif",
};
