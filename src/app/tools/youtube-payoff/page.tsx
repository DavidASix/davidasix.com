"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "~/trpc/react";
import { metadata } from "./_metadata";
import { UrlInput } from "./_components/url-input";
import {
  AnalysisResults,
  SkeletonResults,
} from "./_components/analysis-results";

export default function YoutubePayoffPage() {
  const [url, setUrl] = useState("");

  const analyze = api.tools.youtubePayoff.analyze.useMutation();

  function handleSubmit() {
    if (!url.trim() || analyze.isPending) return;
    analyze.mutate({ url: url.trim(), passkey: "foobar" });
  }

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
          <UrlInput
            url={url}
            onUrlChange={setUrl}
            onSubmit={handleSubmit}
            isLoading={analyze.isPending}
            error={analyze.isError ? analyze.error.message : null}
          />

          {analyze.isPending && <SkeletonResults />}

          {analyze.isSuccess && <AnalysisResults result={analyze.data} />}
        </div>
      </div>
    </main>
  );
}
