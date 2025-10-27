/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Shield, Trash2 } from "lucide-react";

import { api } from "~/trpc/server";
import { createMarkdownComponents } from "~/lib/markdown-components";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

const markdownComponents = createMarkdownComponents();

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await api.project.getProjectBySlug({ slug });

  // Handle logo path
  const logoSrc = project.frontMatter.logo
    ? project.frontMatter.logo.startsWith("local/")
      ? `/cms/images/${project.frontMatter.logo.replace("local/", "")}`
      : project.frontMatter.logo
    : null;

  // Handle screenshots
  const screenshots = project.frontMatter.screenshots?.map((screenshot) =>
    screenshot.startsWith("local/")
      ? `/cms/images/${screenshot.replace("local/", "")}`
      : screenshot,
  );

  // Format date range
  const startDate = new Date(project.frontMatter.start_date);
  const endDate = project.frontMatter.completed_date
    ? new Date(project.frontMatter.completed_date)
    : null;

  const dateRangeDisplay = `${startDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })} - ${
    endDate
      ? endDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })
      : "Present"
  }`;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link
          href="/projects"
          className="text-primary hover:text-primary/80 mb-2 inline-block"
        >
          ← Back to all projects
        </Link>

        {/* Project Container */}
        <article
          id="top"
          className="border-border bg-card/60 relative mx-auto max-w-5xl rounded-lg border-2 p-8 shadow-xl"
        >
          {/* Header Section */}
          <header className="border-border mb-8 border-b-2 pb-6">
            {/* Logo and Title */}
            <div className="mb-6 flex flex-col items-center gap-6 md:flex-row md:items-start">
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt={`${project.frontMatter.title} logo`}
                  className="h-32 w-32 flex-shrink-0 rounded-lg object-contain"
                />
              )}
              <div className="flex-1 space-y-2 text-center md:text-left">
                {/* Category */}
                <p className="text-muted-foreground text-sm tracking-wide uppercase">
                  {project.frontMatter.category}
                </p>

                {/* Title */}
                <h1 className="text-foreground font-jersey-10 text-5xl md:text-6xl">
                  {project.frontMatter.title}
                </h1>

                {/* Date Range */}
                <p className="text-muted-foreground -mt-2 text-sm">
                  {dateRangeDisplay}
                  {project.frontMatter.active_development &&
                    " • Active Development"}
                </p>

                {/* Description */}
                <p className="text-muted-foreground text-xl">
                  {project.frontMatter.short_description}
                </p>
                {/* External Links */}
                <div className="flex flex-wrap items-center justify-start gap-3 pt-2">
                  {project.frontMatter.project_url && (
                    <a
                      href={project.frontMatter.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                    >
                      <img
                        src="/images/button-view-online.webp"
                        alt="View Project Online"
                        className="h-12 w-auto"
                      />
                    </a>
                  )}
                  {project.frontMatter.github_url && (
                    <a
                      href={project.frontMatter.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                    >
                      <img
                        src="/images/button-github.webp"
                        alt="View on GitHub"
                        className="h-12 w-auto"
                      />
                    </a>
                  )}
                  {project.frontMatter.google_play_url && (
                    <a
                      href={project.frontMatter.google_play_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                    >
                      <img
                        src="/images/button-google-play.png"
                        alt="Get it on Google Play"
                        className="h-12 w-auto"
                      />
                    </a>
                  )}
                  {project.frontMatter.apple_store_url && (
                    <a
                      href={project.frontMatter.apple_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                    >
                      <img
                        src="/images/button-apple-store.png"
                        alt="Download on the App Store"
                        className="h-12 w-auto"
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Features & Technologies */}
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Features */}
              {project.frontMatter.features &&
              project.frontMatter.features.length > 0 ? (
                <div className="flex-1">
                  <h3 className="font-jersey-10 mb-2 text-2xl uppercase">
                    Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.frontMatter.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Technologies */}
              {project.frontMatter.technologies &&
              project.frontMatter.technologies.length > 0 ? (
                <div className="flex-1">
                  <h3 className="font-jersey-10 mb-2 text-2xl uppercase">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.frontMatter.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </header>

          {/* Screenshots Gallery */}
          {screenshots && screenshots.length > 0 && (
            <div className="mb-8">
              <h2 className="text-foreground font-jersey-10 mb-4 text-3xl">
                Screenshots
              </h2>
              <Carousel className="mx-auto w-fit max-w-[90%]">
                <CarouselContent>
                  {screenshots.map((screenshot, index) => (
                    <CarouselItem key={index}>
                      <div className="flex items-center justify-center p-1">
                        <img
                          src={screenshot}
                          alt={`${project.frontMatter.title} screenshot ${index + 1}`}
                          className="max-h-[500px] w-auto rounded-lg object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          {/* Markdown Content */}
          <div className="prose mb-8 max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {project.content}
            </ReactMarkdown>
          </div>

          {/* Policy Links */}
          {(project.frontMatter.has_privacy_policy ||
            project.frontMatter.has_data_delete) && (
            <div className="pt-6">
              <h3 className="text-foreground mb-3 text-center text-xl font-semibold">
                Legal & Privacy
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {project.frontMatter.has_privacy_policy && (
                  <Button asChild variant="outline" size="lg">
                    <Link
                      href={`/projects/${slug}/privacy-policy`}
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Privacy Policy
                    </Link>
                  </Button>
                )}
                {project.frontMatter.has_data_delete && (
                  <Button asChild variant="outline" size="lg">
                    <Link
                      href={`/projects/${slug}/data-delete`}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Data Deletion
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Scroll to Top Button */}
          <a
            href="#"
            className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full"
            aria-label="Scroll to top"
          >
            ↑
          </a>
        </article>
      </div>
    </main>
  );
}
