"use client";

import { Suspense, useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

import { metadata } from "./_metadata";
import { UrlInput } from "./_components/url-input";
import { AnalysisResults } from "./_components/analysis-results";
import { VideoHeader, VideoHeaderSkeleton } from "./_components/video-header";
import { VideoList } from "./_components/video-list";
import {
  VideoSummary,
  VideoSummarySkeleton,
} from "./_components/video-summary";

import { PasskeyInput } from "../_components/passkey-input";
import { usePasskey } from "../_hooks/usePasskey";

function YoutubePayoffContent() {
  const [url, setUrl] = useState("");
  const [ghostMode, setGhostMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedVideoUuid = searchParams.get("uuid");

  const {
    hasPasskey,
    encryptedPasskey,
    passkeyInput,
    setPasskeyInput,
    handleEncryptPasskey,
    handleClearPasskey,
    isEncrypting,
    encryptError,
  } = usePasskey();

  const utils = api.useUtils();
  const analyze = api.tools.youtubePayoff.analyze.useMutation({
    onSuccess: (_data, variables) => {
      if (!variables.ghost) {
        void utils.tools.youtubePayoff.selectVideos.invalidate();
      }
    },
  });
  const selectedVideo = api.tools.youtubePayoff.selectVideo.useQuery(
    { uuid: selectedVideoUuid ?? "" },
    { enabled: selectedVideoUuid !== null },
  );

  const handleSubmit = useCallback(() => {
    if (!url.trim() || !hasPasskey || analyze.isPending) return;
    analyze.mutate({
      url: url.trim(),
      passkey: encryptedPasskey,
      ...(ghostMode && { ghost: true }),
    });
  }, [url, hasPasskey, encryptedPasskey, ghostMode, analyze]);

  const handleSelectedVideoChange = useCallback(
    (uuid: string | null) => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());

      if (uuid) {
        nextSearchParams.set("uuid", uuid);
      } else {
        nextSearchParams.delete("uuid");
      }

      const query = nextSearchParams.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const error =
    encryptError ?? (analyze.isError ? analyze.error.message : null);

  return (
    <>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-foreground font-jersey-10 mb-4 text-6xl leading-none md:text-7xl lg:text-[7rem]">
              {metadata.title}
            </h1>
            <div className="text-muted-foreground prose prose-invert mx-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {metadata.description}
              </ReactMarkdown>
            </div>
          </div>

          <div className="mx-auto max-w-7xl space-y-8">
            <div className="mx-auto max-w-4xl space-y-3">
              <PasskeyInput
                hasPasskey={hasPasskey}
                passkeyInput={passkeyInput}
                onPasskeyChange={setPasskeyInput}
                onPasskeySubmit={handleEncryptPasskey}
                isEncrypting={isEncrypting}
                onClearPasskey={handleClearPasskey}
              />
              <UrlInput
                url={url}
                onUrlChange={setUrl}
                onSubmit={handleSubmit}
                isLoading={analyze.isPending}
                hasPasskey={hasPasskey}
                ghostMode={ghostMode}
                onGhostModeChange={setGhostMode}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>

            {analyze.isPending && (
              <div className="space-y-4">
                <VideoHeaderSkeleton />
                <VideoSummarySkeleton />
              </div>
            )}

            {analyze.isSuccess && <AnalysisResults result={analyze.data} />}

            <VideoList onVideoSelect={handleSelectedVideoChange} />
          </div>
        </div>
      </main>

      <Dialog
        open={selectedVideoUuid !== null}
        onOpenChange={(open) => {
          if (!open) handleSelectedVideoChange(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="dialog-surface border-dialog-border bg-dialog text-dialog-foreground ring-primary/20 max-h-[calc(100dvh-1rem)] max-w-[calc(100%-2rem)] grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 shadow-2xl ring-1 backdrop-blur-sm sm:max-h-[90dvh] sm:max-w-5xl"
        >
          <div className="border-border flex shrink-0 items-center gap-3 border-b px-4 py-3 sm:px-6">
            <DialogTitle className="min-w-0 flex-1 truncate text-sm font-bold sm:text-base">
              {selectedVideo.data?.title ?? "Video analysis"}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 focus-visible:ring-1"
                aria-label="Close video analysis"
              >
                <X className="size-5" />
              </Button>
            </DialogClose>
          </div>

          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            {selectedVideo.isPending && (
              <div className="space-y-4">
                <VideoHeaderSkeleton surface="dialog" />
                <VideoSummarySkeleton surface="dialog" />
              </div>
            )}

            {selectedVideo.isError && (
              <p className="text-destructive py-8 text-center text-sm">
                {selectedVideo.error.message}
              </p>
            )}

            {selectedVideo.data && (
              <div className="space-y-4">
                <VideoHeader video={selectedVideo.data} surface="dialog" />
                <VideoSummary video={selectedVideo.data} surface="dialog" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function YoutubePayoffPage() {
  return (
    <Suspense>
      <YoutubePayoffContent />
    </Suspense>
  );
}
