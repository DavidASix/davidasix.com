/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

import { api } from "~/trpc/server";
import { PizzaRating } from "../_components/pizza-rating";

// Custom markdown components
const markdownComponents: Components = {
  img: ({ src, alt, ...props }) => {
    if (!src || typeof src !== "string") return null;

    // Handle local images (local/image-name.webp -> /cms/images/image-name.webp)
    const imageSrc = src.startsWith("local/")
      ? `/cms/images/${src.replace("local/", "")}`
      : src;

    return (
      <span className="my-6 block">
        <img
          src={imageSrc}
          alt={alt ?? ""}
          className="mx-auto max-h-[500px] rounded-lg object-contain shadow-lg"
          style={{ maxWidth: "100%" }}
          {...props}
        />
        {alt && (
          <span className="text-muted-foreground mt-2 block text-center text-sm italic">
            {alt}
          </span>
        )}
      </span>
    );
  },
  h1: ({ children, ...props }) => (
    <h1 className="text-foreground mb-6 text-4xl font-bold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-8 mb-4 text-3xl font-bold text-amber-700" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 mb-3 text-2xl font-bold text-amber-700" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-foreground mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="text-foreground mb-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="text-foreground mb-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-amber-700 underline hover:text-amber-600"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="text-muted-foreground my-4 border-l-4 border-amber-700 pl-4 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-muted rounded px-1 py-0.5 font-mono text-sm text-amber-700"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="bg-muted text-foreground my-4 block rounded p-4 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  },
};

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
