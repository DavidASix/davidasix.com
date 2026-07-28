import { AlertCircle } from "lucide-react";

import { Card, CardContent } from "~/components/ui/card";
import { type RouterOutputs } from "~/trpc/react";

import { VideoHeader } from "./video-header";
import { VideoSummary } from "./video-summary";

export function AnalysisResults({
  result,
}: {
  result: RouterOutputs["tools"]["youtubePayoff"]["analyze"];
}) {
  if (result.transcriptUnavailable) {
    return (
      <div className="space-y-4">
        <VideoHeader video={result} />
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
    <div className="space-y-4">
      <VideoHeader video={result} />
      <VideoSummary video={result} />
    </div>
  );
}
