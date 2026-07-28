"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createMarkdownComponents } from "~/lib/markdown-components";
import { AlertCircle, Check, Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

const markdownComponents = createMarkdownComponents({
  h2: "mt-0",
  h3: "mt-0",
});

function CopyTranscriptButton({ transcript }: { transcript: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const decoder = document.createElement("textarea");
    decoder.innerHTML = transcript;
    await navigator.clipboard.writeText(decoder.value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="mt-3 w-fit"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy transcript"}
    </Button>
  );
}

function ThumbnailAnalysis({
  thumbnailUrl,
  title,
  description,
  text,
}: {
  thumbnailUrl: string;
  title: string;
  description: string;
  text: string;
}) {
  return (
    <HoverCard openDelay={250} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label="View thumbnail analysis"
          className="focus-visible:ring-ring h-24 w-40 shrink-0 cursor-help overflow-hidden rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80 space-y-3">
        <div>
          <p className="text-sm font-semibold">Thumbnail analysis</p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        {text && (
          <div className="border-border border-t pt-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Text in thumbnail
            </p>
            <p className="mt-1 text-sm">{text}</p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

type YoutubeVideo =
  RouterOutputs["tools"]["youtubePayoff"]["selectVideos"][number];

export function VideoOverviewCard({
  video,
  className,
}: {
  video: YoutubeVideo;
  className?: string;
}) {
  return (
    <Card className={cn("bg-background/40", className)}>
      <CardContent className="pt-0">
        <div className="flex gap-4">
          <ThumbnailAnalysis
            thumbnailUrl={video.thumbnailUrl}
            title={video.title}
            description={video.thumbnailAnalysis ?? ""}
            text={video.thumbnailText ?? ""}
          />
          <div className="flex min-w-0 flex-col justify-center sm:justify-start">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary line-clamp-2 text-sm font-medium transition-colors hover:underline"
            >
              {video.title}
            </a>
            <p className="text-muted-foreground mt-1 text-xs">{video.author}</p>
            {!video.transcriptUnavailable && (
              <>
                <CopyTranscriptButton transcript={video.transcript ?? ""} />
                <p className="text-foreground/90 mt-2 hidden text-sm leading-relaxed sm:block">
                  {video.shortSummary}
                </p>
              </>
            )}
          </div>
        </div>
        {!video.transcriptUnavailable && (
          <p className="text-foreground/90 mt-4 block text-sm leading-relaxed sm:hidden">
            {video.shortSummary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function AnalysisResults({
  result,
}: {
  result: RouterOutputs["tools"]["youtubePayoff"]["analyze"];
}) {
  if (result.transcriptUnavailable) {
    return (
      <div className="space-y-4">
        <VideoOverviewCard video={result} />
        <Card className="bg-background/40">
          <CardContent className="flex items-start gap-3 pt-0">
            <AlertCircle className="text-muted-foreground mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-foreground font-medium">
                Transcript unavailable
              </p>
              <p className="text-muted-foreground text-sm">
                This video doesn&apos;t have captions available, so we
                can&apos;t analyze it. Try a video with subtitles enabled.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <VideoOverviewCard video={result} className="md:col-span-2" />

      <div className="space-y-4">
        <Card className="bg-background/40 h-min">
          <CardHeader>
            <CardTitle className="text-foreground font-jersey-10 text-2xl">
              The Promise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-sm leading-relaxed">
              {result.promise}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/40 h-min">
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
                {result.structure}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background/40 h-min">
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
              {result.analysis}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SkeletonResults() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-background/40 md:col-span-2">
        <CardContent className="pt-0">
          <div className="flex gap-4">
            <Skeleton className="h-24 w-40 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2 pt-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Card className="bg-background/40">
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
        <Card className="bg-background/40">
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
      <Card className="bg-background/40">
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
