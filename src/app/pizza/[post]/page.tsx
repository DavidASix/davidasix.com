import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "~/trpc/server";
import Image from "next/image";
import type { Components } from "react-markdown";
import { PizzaRating } from "~/app/_components/pizza-rating";

// Custom markdown components
const markdownComponents: Components = {
  img: ({ node, src, alt, ...props }) => {
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
          className="mx-auto rounded-lg shadow-lg"
          style={{ maxWidth: "100%", height: "auto" }}
          {...props}
        />
        {alt && (
          <span className="mt-2 block text-center text-sm italic text-gray-300">
            {alt}
          </span>
        )}
      </span>
    );
  },
  h1: ({ node, children, ...props }) => (
    <h1 className="mb-6 text-4xl font-bold text-white" {...props}>
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }) => (
    <h2 className="mb-4 mt-8 text-3xl font-bold text-amber-300" {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 className="mb-3 mt-6 text-2xl font-semibold text-amber-200" {...props}>
      {children}
    </h3>
  ),
  p: ({ node, children, ...props }) => (
    <p className="mb-4 leading-relaxed text-gray-100" {...props}>
      {children}
    </p>
  ),
  ul: ({ node, children, ...props }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-100" {...props}>
      {children}
    </ul>
  ),
  ol: ({ node, children, ...props }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-100" {...props}>
      {children}
    </ol>
  ),
  a: ({ node, children, href, ...props }) => (
    <a
      href={href}
      className="text-amber-300 underline hover:text-amber-100"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ node, children, ...props }) => (
    <blockquote
      className="my-4 border-l-4 border-amber-400 pl-4 italic text-gray-300"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ node, className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded bg-gray-800 px-1 py-0.5 font-mono text-sm text-amber-300"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="my-4 block rounded bg-gray-800 p-4 font-mono text-sm text-amber-300"
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
    <main className="min-h-screen bg-gradient-to-b from-red-900 via-orange-800 to-yellow-700">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link
          href="/pizza"
          className="mb-8 inline-block text-amber-300 hover:text-white"
        >
          ← Back to all reviews
        </Link>

        {/* Post Container */}
        <article className="mx-auto max-w-4xl rounded-lg border-4 border-white/20 bg-white/10 p-8 backdrop-blur-sm shadow-2xl">
          {/* Header Section */}
          <header className="mb-8 border-b-2 border-amber-400/50 pb-6">
            <h1 className="mb-4 text-5xl font-extrabold text-white">
              {post.frontMatter["pizza-shop"]}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="text-lg text-amber-200">
                {new Date(post.frontMatter["purchase-date"]).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>

              {post.frontMatter["better-than-ginos"] ? (
                <span className="rounded-full bg-green-600 px-4 py-1 text-sm font-bold text-white">
                  ✓ Better than Gino's
                </span>
              ) : (
                <span className="rounded-full bg-red-600 px-4 py-1 text-sm font-bold text-white">
                  ✗ Not better than Gino's
                </span>
              )}
            </div>

            <div className="mb-4">
              <PizzaRating rating={post.frontMatter.rating} size="large" />
            </div>

            <div className="rounded-lg bg-amber-900/30 p-4">
              <p className="text-sm uppercase tracking-wide text-amber-400">
                TL;DR
              </p>
              <p className="text-lg italic text-white">
                {post.frontMatter.tldr}
              </p>
            </div>
          </header>

          {/* Markdown Content */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Back Button (Bottom) */}
        <div className="mt-8 text-center">
          <Link
            href="/pizza"
            className="inline-block rounded-lg bg-amber-600 px-6 py-3 font-bold text-white transition-all hover:bg-amber-500 hover:shadow-lg"
          >
            ← Back to all pizza reviews
          </Link>
        </div>
      </div>
    </main>
  );
}
