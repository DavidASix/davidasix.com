import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api } from "~/trpc/server";
import { createMarkdownComponents } from "~/lib/markdown-components";

const markdownComponents = createMarkdownComponents();

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Get the project to display title
  const project = await api.project.getProjectBySlug({ slug });

  // Get privacy policy
  const policy = await api.project.getPrivacyPolicy({ slug });

  // If policy doesn't exist, return 404
  if (!policy) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link
          href={`/projects/${slug}`}
          className="text-primary hover:text-primary/80 mb-2 inline-block"
        >
          ← Back to {project.frontMatter.title}
        </Link>

        {/* Policy Container */}
        <article className="border-border bg-card/60 mx-auto max-w-4xl rounded-lg border-2 p-8 shadow-xl">
          {/* Header */}
          <header className="border-border mb-8 border-b-2 pb-6">
            <h1 className="text-foreground font-jersey-10 mb-4 text-5xl">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              {project.frontMatter.title}
            </p>
          </header>

          {/* Policy Content */}
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {policy.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Back Button (Bottom) */}
        <div className="mt-8 text-center">
          <Link
            href={`/projects/${slug}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-6 py-3 font-bold transition-all hover:shadow-lg"
          >
            ← Back to {project.frontMatter.title}
          </Link>
        </div>
      </div>
    </main>
  );
}
