"use client";

import { api } from "~/trpc/react";

import { VideoListItem } from "./video-header";

export function VideoList({
  onVideoSelect,
}: {
  onVideoSelect: (uuid: string) => void;
}) {
  const videos = api.tools.youtubePayoff.selectVideos.useQuery();

  if (videos.isPending) {
    return (
      <p className="text-muted-foreground text-sm">Loading recent lookups…</p>
    );
  }

  if (videos.isError) {
    return <p className="text-destructive text-sm">{videos.error.message}</p>;
  }

  if (videos.data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No lookups completed</p>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-foreground font-jersey-10 text-3xl">
        Recent lookups
      </h2>
      <div className="space-y-4">
        {videos.data.map((video) => (
          <VideoListItem
            key={video.id}
            video={video}
            onSelect={onVideoSelect}
          />
        ))}
      </div>
    </section>
  );
}
