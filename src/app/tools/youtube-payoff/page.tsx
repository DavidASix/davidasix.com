"use client";

import { Suspense, useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
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
    onSuccess: () => {
      void utils.tools.youtubePayoff.selectVideos.invalidate();
    },
  });
  const selectedVideo = api.tools.youtubePayoff.selectVideo.useQuery(
    { uuid: selectedVideoUuid ?? "" },
    { enabled: selectedVideoUuid !== null },
  );

  const handleSubmit = useCallback(() => {
    if (!url.trim() || !hasPasskey || analyze.isPending) return;
    analyze.mutate({ url: url.trim(), passkey: encryptedPasskey });
  }, [url, hasPasskey, encryptedPasskey, analyze]);

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
        <DialogContent className="border-dialog-border bg-dialog text-dialog-foreground max-h-[calc(100vh-2rem)] overflow-y-auto backdrop-blur-md sm:max-w-6xl">
          <DialogTitle className="sr-only">
            {selectedVideo.data?.title ?? "Video analysis"}
          </DialogTitle>

          {selectedVideo.isPending && (
            <div className="space-y-4">
              <VideoHeaderSkeleton />
              <VideoSummarySkeleton />
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

export default function YoutubePayoffPage() {
  return (
    <Suspense>
      <YoutubePayoffContent />
    </Suspense>
  );
}
