/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

import { api } from "~/trpc/server";

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
    <h2 className="mt-8 mb-4 text-3xl font-bold" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 mb-3 text-2xl font-bold" {...props}>
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
      className="text-primary hover:text-primary/80 underline"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-primary text-muted-foreground my-4 border-l-4 pl-4 italic"
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
          className="bg-muted text-primary rounded px-1 py-0.5 font-mono text-sm"
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ post: string }>;
}) {
  const { post: slug } = await params;
  const post = await api.blog.getPostBySlug({ slug });

  // Handle header image path
  const headerImage = post.frontMatter.header_image
    ? post.frontMatter.header_image.startsWith("local/")
      ? `/cms/images/${post.frontMatter.header_image.replace("local/", "").replace(")", "")}`
      : post.frontMatter.header_image
    : null;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link
          href="/blog"
          className="text-primary hover:text-primary/80 mb-2 inline-block"
        >
          ← Back to all posts
        </Link>

        {/* Post Container */}
        <article className="border-border bg-card/60 mx-auto max-w-4xl rounded-lg border-2 p-8 shadow-xl">
          {/* Header Section */}
          <header className="border-border mb-8 border-b-2 pb-6">
            <h1
              className="text-foreground mb-4 text-6xl"
              style={{ fontFamily: "var(--font-jersey-10)" }}
            >
              {post.frontMatter.title}
            </h1>

            {post.frontMatter.subtitle && (
              <p className="text-muted-foreground mb-4 text-xl">
                {post.frontMatter.subtitle}
              </p>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="text-muted-foreground text-lg">
                {new Date(post.frontMatter.publish_date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>
            </div>

            {/* Header Image */}
            {headerImage && (
              <div className="mt-6">
                <img
                  src={headerImage}
                  alt={post.frontMatter.title}
                  className="w-full rounded-lg object-cover shadow-lg"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            )}
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
            href="/blog"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-6 py-3 font-bold transition-all hover:shadow-lg"
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    </main>
  );
}
