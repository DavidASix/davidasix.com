/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { api } from "~/trpc/server";

interface BlogPost {
  slug: string;
  frontMatter: {
    title: string;
    original_link?: string;
    publish_date: string;
    subtitle?: string;
    header_image?: string;
  };
  content: string;
}

function BlogListItem({ post }: { post: BlogPost }) {
  // Truncate content to 164 characters
  const contentPreview =
    post.content.length > 164
      ? post.content.substring(0, 164) + "..."
      : post.content;

  // Handle header image path
  const headerImage = post.frontMatter.header_image
    ? post.frontMatter.header_image.startsWith("local/")
      ? `/cms/images/${post.frontMatter.header_image.replace("local/", "").replace(")", "")}`
      : post.frontMatter.header_image
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group border-border bg-background/40 hover:border-primary flex flex-col gap-4 rounded-lg border p-6 transition-all duration-300 hover:shadow-lg md:flex-row md:gap-6"
    >
      {/* Thumbnail */}
      {headerImage && (
        <div className="w-full flex-shrink-0 md:w-24">
          <img
            src={headerImage}
            alt={post.frontMatter.title}
            className="h-48 w-full rounded-md object-cover md:h-24 md:w-24"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h2
          className="text-foreground group-hover:text-primary mb-1 text-3xl transition-colors"
          style={{ fontFamily: "var(--font-jersey-10)" }}
        >
          {post.frontMatter.title}
        </h2>

        {post.frontMatter.subtitle && (
          <p className="text-muted-foreground mb-0.5 text-sm">
            {post.frontMatter.subtitle}
          </p>
        )}

        <p className="text-muted-foreground mb-3 text-sm">
          {new Date(post.frontMatter.publish_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <p className="text-muted-foreground mb-3 text-sm">{contentPreview}</p>

        <div className="text-primary text-sm font-semibold">Read more →</div>
      </div>
    </Link>
  );
}

export default async function BlogListPage() {
  const posts = await api.blog.getAllPosts();

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1
            className="text-foreground mb-6 text-6xl leading-none md:text-7xl lg:text-[7rem]"
            style={{ fontFamily: "var(--font-jersey-10)" }}
          >
            Blog
          </h1>
          <p className="text-muted-foreground text-xl">
            Thoughts, projects, and learnings
          </p>
        </div>

        {/* Blog Articles List */}
        <div className="mx-auto max-w-4xl space-y-6">
          {posts.map((post) => (
            <BlogListItem key={post.slug} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center">
            <p className="text-foreground text-xl">No blog posts yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
