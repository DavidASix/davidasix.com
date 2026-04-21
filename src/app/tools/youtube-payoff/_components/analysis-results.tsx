"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createMarkdownComponents } from "~/lib/markdown-components";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { type RouterOutputs } from "~/trpc/react";

const markdownComponents = createMarkdownComponents({
  h2: "mt-0",
});

export function AnalysisResults({
  result,
}: {
  result: RouterOutputs["tools"]["youtubePayoff"]["analyze"];
}) {
  if (result.transcript_unavailable) {
    return (
      <div className="space-y-4">
        <Card className="bg-background/40">
          <CardContent className="flex gap-4 pt-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.thumbnail_url}
              alt={result.title}
              className="h-24 w-40 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary line-clamp-2 text-sm font-medium transition-colors hover:underline"
              >
                {result.title}
              </a>
              <p className="text-muted-foreground mt-1 text-xs">
                {result.author}
              </p>
            </div>
          </CardContent>
        </Card>
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
      <Card className="bg-background/40 md:col-span-2">
        <CardContent className="pt-0">
          <div className="flex gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.thumbnail_url}
              alt={result.title}
              className="h-24 w-40 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary line-clamp-2 text-sm font-medium transition-colors hover:underline"
              >
                {result.title}
              </a>
              <p className="text-muted-foreground mt-1 text-xs">
                {result.author}
              </p>
              <p className="text-foreground/90 mt-2 text-sm leading-relaxed">
                {result.short_summary}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background/40 h-min">
        <CardHeader>
          <CardTitle className="text-foreground font-jersey-10 text-2xl">
            Payoff
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {result.payoff}
            </ReactMarkdown>
          </div>
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
      <Card className="bg-background/40">
        <CardHeader>
          <CardTitle className="font-jersey-10 text-xl">Payoff</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
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
  );
}
