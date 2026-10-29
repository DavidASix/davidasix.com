/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api } from "~/trpc/server";
import {
  createMarkdownComponents,
  remarkGithubAlerts,
} from "~/lib/markdown-components";
import {
  extractMarkdownHeadings,
  remarkHeadingIds,
} from "~/lib/markdown-headings";
import { TableOfContents } from "~/components/table-of-contents";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const markdownComponents = createMarkdownComponents();

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ post: string }>;
}) {
  const { post: slug } = await params;
  const post = await api.blog.getPostBySlug({ slug });

  const headings = extractMarkdownHeadings(post.content);

  // Handle header image path
  const headerImage = post.frontMatter.header_image
    ? post.frontMatter.header_image.startsWith("local/")
      ? `/cms/images/${post.frontMatter.header_image.replace("local/", "").replace(")", "")}`
      : post.frontMatter.header_image
    : null;

  return (
    <main className="min-h-screen" id="top">
      <div className="container mx-auto px-4 py-4">
        {/* Back Button */}
        <Button asChild variant="link">
          <Link href="/blog">← Back to all posts</Link>
        </Button>
      </div>
      <div className="border-muted-foreground h-10 w-full border-y-1">
        <div className="mx-auto flex h-full max-w-5xl items-center gap-4 py-2 pl-1">
          <span className="text-muted-foreground text-sm font-light tracking-tighter">
            /davidasix/blog/{slug}.md
          </span>
        </div>
      </div>
      {/* Post Container */}
      <div
        className={cn(
          "relative mx-auto max-w-5xl",
          headings.length > 0 && "lg:max-w-[min(64rem,calc(100%-28rem))]",
        )}
      >
        {headings.length > 0 && (
          <div className="px-8 py-4 lg:absolute lg:top-0 lg:left-full lg:h-full lg:w-56 lg:py-8 lg:pl-8">
            <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
              <TableOfContents headings={headings} />
            </div>
          </div>
        )}
        <article className="border-muted-foreground bg-card/20 mx-auto max-w-5xl border-x-1">
          {/* Header Section */}
          <header className="border-muted-foreground border-b-2 p-8">
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
                  className="w-full object-contain"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            )}
          </header>

          {/* Markdown Content */}
          <div className="max-w-none p-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkGithubAlerts, remarkHeadingIds]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>

      {/* Back Button (Bottom) */}
      <div className="border-muted-foreground border-t py-4 text-center">
        <div className="mx-auto flex max-w-5xl justify-start">
          <Button asChild variant="link">
            <a href="#top">Scroll to top</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
