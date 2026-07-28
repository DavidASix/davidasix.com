"use client";

import { useState, type MouseEvent } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

type YoutubeVideo =
  RouterOutputs["tools"]["youtubePayoff"]["selectVideos"][number];

function CopyTranscriptButton({ transcript }: { transcript: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
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
          onClick={(event) => event.stopPropagation()}
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
      <HoverCardContent
        align="start"
        className="w-80 space-y-3"
        onClick={(event) => event.stopPropagation()}
      >
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

export function VideoHeader({
  video,
  className,
  showCopyTranscriptButton = true,
}: {
  video: YoutubeVideo;
  className?: string;
  showCopyTranscriptButton?: boolean;
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
              onClick={(event) => event.stopPropagation()}
              className="text-foreground hover:text-primary line-clamp-2 text-sm font-medium transition-colors hover:underline"
            >
              {video.title}
            </a>
            <p className="text-muted-foreground mt-1 text-xs">{video.author}</p>
            {!video.transcriptUnavailable && (
              <>
                {showCopyTranscriptButton && (
                  <CopyTranscriptButton transcript={video.transcript ?? ""} />
                )}
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

export function VideoHeaderSkeleton() {
  return (
    <Card className="bg-background/40">
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
  );
}
