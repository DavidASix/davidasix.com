import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api } from "~/trpc/server";
import { PizzaRating } from "../_components/pizza-rating";
import { createMarkdownComponents } from "~/lib/markdown-components";

// Custom markdown components for pizza (amber theme)
const markdownComponents = createMarkdownComponents({
  h2: "text-amber-700",
  h3: "text-amber-700",
  a: "text-amber-700",
  aHover: "hover:text-amber-600",
  blockquoteBorder: "border-amber-700",
  inlineCode: "text-amber-700",
});

export default async function PizzaPostPage({
  params,
}: {
  params: Promise<{ post: string }>;
}) {
  const { post: slug } = await params;
  const post = await api.pizza.getPostBySlug({ slug });

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link
          href="/pizza"
          className="mb-8 inline-block text-amber-700 hover:text-amber-600"
        >
          ← Back to all reviews
        </Link>

        {/* Post Container */}
        <article className="border-border bg-card/60 mx-auto max-w-4xl rounded-lg border-2 p-8 shadow-xl">
          {/* Header Section */}
          <header className="mb-8 border-b-2 border-amber-700/30 pb-6">
            <h1
              className="text-foreground mb-4 text-6xl"
              style={{ fontFamily: "var(--font-bagel-fat-one)" }}
            >
              {post.frontMatter["pizza-shop"]}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="text-muted-foreground text-lg">
                {new Date(post.frontMatter["purchase-date"]).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>

              {post.frontMatter["better-than-ginos"] === true ? (
                <div className="mb-4 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                  ✓ Better than Gino&apos;s
                </div>
              ) : post.frontMatter["better-than-ginos"] === false ? (
                <div className="mb-4 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                  ✗ Not better than Gino&apos;s
                </div>
              ) : null}
            </div>

            <div className="mb-4">
              <PizzaRating
                rating={post.frontMatter.rating}
                className="text-3xl"
              />
            </div>

            <div className="rounded-lg border border-amber-700/20 bg-amber-700/10 p-4">
              <p className="text-sm font-semibold tracking-wide text-amber-700 uppercase">
                TL;DR
              </p>
              <p className="text-foreground text-lg italic">
                {post.frontMatter.tldr}
              </p>
            </div>
          </header>

          {/* Markdown Content */}
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Back Button (Bottom) */}
        <div className="mt-8 text-center">
          <Link
            href="/pizza"
            className="inline-block rounded-lg bg-amber-700 px-6 py-3 font-bold text-white transition-all hover:bg-amber-600 hover:shadow-lg"
          >
            ← Back to all pizza reviews
          </Link>
        </div>
      </div>
    </main>
  );
}
