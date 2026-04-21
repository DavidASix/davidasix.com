"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api } from "~/trpc/react";

import { metadata } from "./_metadata";
import { UrlInput } from "./_components/url-input";
import {
  AnalysisResults,
  SkeletonResults,
} from "./_components/analysis-results";

import { PasskeyInput } from "../_components/passkey-input";
import { usePasskey } from "../_hooks/usePasskey";

export default function YoutubePayoffPage() {
  const [url, setUrl] = useState("");

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

  const analyze = api.tools.youtubePayoff.analyze.useMutation();

  const handleSubmit = useCallback(() => {
    if (!url.trim() || !hasPasskey || analyze.isPending) return;
    analyze.mutate({ url: url.trim(), passkey: encryptedPasskey });
  }, [url, hasPasskey, encryptedPasskey, analyze]);

  const error =
    encryptError ?? (analyze.isError ? analyze.error.message : null);

  return (
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

          {analyze.isPending && <SkeletonResults />}

          {analyze.isSuccess && <AnalysisResults result={analyze.data} />}
        </div>
      </div>
    </main>
  );
}
