import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { createMarkdownComponents } from "~/lib/markdown-components";
import { type RouterOutputs } from "~/trpc/react";

const markdownComponents = createMarkdownComponents({
  h2: "mt-0",
  h3: "mt-0",
});

type YoutubeVideo =
  RouterOutputs["tools"]["youtubePayoff"]["selectVideos"][number];

export function VideoSummary({ video }: { video: YoutubeVideo }) {
  if (video.transcriptUnavailable) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Card className="bg-background/40 h-min">
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
                {video.structure}
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
              {video.analysis}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
