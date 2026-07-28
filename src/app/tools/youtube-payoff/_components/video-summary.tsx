import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { createMarkdownComponents } from "~/lib/markdown-components";
import { type RouterOutputs } from "~/trpc/react";
import type { SurfaceType } from "./types";
import { cn } from "~/lib/utils";

const markdownComponents = createMarkdownComponents({
  h2: "mt-0",
  h3: "mt-0",
});

type YoutubeVideo =
  RouterOutputs["tools"]["youtubePayoff"]["selectVideos"][number];

export function VideoSummary({
  video,
  surface = "default",
}: {
  video: YoutubeVideo;
  surface?: SurfaceType;
}) {
  if (video.transcriptUnavailable) return null;
  const isDialog = surface === "dialog";
  const OuterContainer = isDialog ? Card : "div";
  const InnerContainer = isDialog ? "div" : Card;
  return (
    <OuterContainer className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <InnerContainer
          className={cn(!isDialog && "bg-background/40", "h-min")}
        >
          <CardHeader>
            <CardTitle className="text-foreground font-jersey-10 text-2xl">
              The Promise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-sm leading-relaxed">
              {video.promise}
            </p>
          </CardContent>
        </InnerContainer>

        <InnerContainer
          className={cn(!isDialog && "bg-background/40", "h-min")}
        >
          <CardHeader>
            <CardTitle className="text-foreground font-jersey-10 text-2xl">
              Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {video.structure}
              </ReactMarkdown>
            </div>
          </CardContent>
        </InnerContainer>
      </div>

      <InnerContainer
        className={cn(
          !isDialog ? "bg-background/40" : "border-border border-s-1",
          "h-min",
        )}
      >
        <CardHeader>
          <CardTitle className="text-foreground font-jersey-10 text-2xl">
            Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {video.analysis}
            </ReactMarkdown>
          </div>
        </CardContent>
      </InnerContainer>
    </OuterContainer>
  );
}

export function VideoSummarySkeleton({
  surface = "default",
}: {
  surface?: SurfaceType;
}) {
  const isDialog = surface === "dialog";
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Card className={cn(!isDialog && "bg-background/40")}>
          <CardHeader>
            <CardTitle className="font-jersey-10 text-xl">
              The Promise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
        <Card className={cn(!isDialog && "bg-background/40")}>
          <CardHeader>
            <CardTitle className="font-jersey-10 text-xl">Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
      <Card className={cn(!isDialog && "bg-background/40")}>
        <CardHeader>
          <CardTitle className="font-jersey-10 text-xl">Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    </div>
  );
}
