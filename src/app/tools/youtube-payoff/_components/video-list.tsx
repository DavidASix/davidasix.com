"use client";

import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

import { VideoHeader, VideoListItem } from "./video-header";
import { VideoSummary } from "./video-summary";

export function VideoList({
  selectedVideoUuid,
  onSelectedVideoChange,
}: {
  selectedVideoUuid: string | null;
  onSelectedVideoChange: (uuid: string | null) => void;
}) {
  const videos = api.tools.youtubePayoff.selectVideos.useQuery();
  const selectedVideo = api.tools.youtubePayoff.selectVideo.useQuery(
    { uuid: selectedVideoUuid ?? "" },
    { enabled: selectedVideoUuid !== null },
  );

  let listContent;

  if (videos.isPending) {
    listContent = (
      <p className="text-muted-foreground text-sm">Loading recent lookups…</p>
    );
  } else if (videos.isError) {
    listContent = (
      <p className="text-destructive text-sm">{videos.error.message}</p>
    );
  } else if (videos.data.length === 0) {
    listContent = (
      <p className="text-muted-foreground text-sm">No lookups completed</p>
    );
  } else {
    listContent = (
      <section className="space-y-4">
        <h2 className="text-foreground font-jersey-10 text-3xl">
          Recent lookups
        </h2>
        <div className="space-y-4">
          {videos.data.map((video) => (
            <VideoListItem
              key={video.id}
              video={video}
              onSelect={onSelectedVideoChange}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {listContent}
      <Dialog
        open={selectedVideoUuid !== null}
        onOpenChange={(open) => {
          if (!open) onSelectedVideoChange(null);
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-6xl">
          <DialogTitle className="sr-only">
            {selectedVideo.data?.title ?? "Video analysis"}
          </DialogTitle>

          {selectedVideo.isPending && (
            <div className="space-y-4">
              <Skeleton className="h-36 w-full rounded-xl" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            </div>
          )}

          {selectedVideo.isError && (
            <p className="text-destructive py-8 text-center text-sm">
              {selectedVideo.error.message}
            </p>
          )}

          {selectedVideo.data && (
            <div className="space-y-4">
              <VideoHeader video={selectedVideo.data} />
              <VideoSummary video={selectedVideo.data} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
