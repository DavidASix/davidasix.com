"use client";

import { api, type RouterOutputs } from "~/trpc/react";

import { VideoHeader } from "./video-header";

type YoutubeVideo =
  RouterOutputs["tools"]["youtubePayoff"]["selectVideos"][number];

function VideoListItem({
  video,
  onSelect,
}: {
  video: YoutubeVideo;
  onSelect: (uuid: string) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(video.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(video.id);
        }
      }}
      className="focus-visible:ring-ring cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <VideoHeader
        video={video}
        showCopyTranscriptButton={false}
        className="hover:bg-accent/40 transition-colors"
      />
    </div>
  );
}

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
