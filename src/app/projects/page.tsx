/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { api } from "~/trpc/server";

interface Project {
  slug: string;
  frontMatter: {
    title: string;
    category: string;
    start_date: string;
    completed_date?: string;
    short_description: string;
    logo?: string;
    active_development: boolean;
  };
  content: string;
}

function ProjectCard({ project }: { project: Project }) {
  // Handle logo path
  const logoSrc = project.frontMatter.logo
    ? project.frontMatter.logo.startsWith("local/")
      ? `/cms/images/${project.frontMatter.logo.replace("local/", "")}`
      : project.frontMatter.logo
    : null;

  // Format date range
  const startYear = new Date(project.frontMatter.start_date).getFullYear();
  const endDisplay = project.frontMatter.completed_date
    ? new Date(project.frontMatter.completed_date).getFullYear()
    : "Present";
  const dateRange = `${startYear} - ${endDisplay}`;

  // Truncate description to 164 characters
  const truncatedDescription =
    project.frontMatter.short_description.length > 164
      ? project.frontMatter.short_description.substring(0, 164) + "..."
      : project.frontMatter.short_description;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group border-border bg-background/40 hover:border-primary blur-li relative overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
    >
      <div className="flex gap-4 p-6">
        {/* Logo */}
        {logoSrc && (
          <div className="flex-shrink-0">
            <img
              src={logoSrc}
              alt={`${project.frontMatter.title} logo`}
              className="h-32 w-32 rounded-lg object-contain"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Title */}
          <h3 className="text-foreground group-hover:text-primary font-jersey-10 mb-1 text-2xl transition-colors">
            {project.frontMatter.title}
          </h3>

          {/* Date Range */}
          <p className="text-muted-foreground mb-2 text-sm">{dateRange}</p>

          {/* Short Description */}
          <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
            {truncatedDescription}
          </p>

          {/* Read More */}
          <div className="text-primary mt-auto text-sm font-semibold">
            View project →
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function ProjectsListPage() {
  const projects = await api.project.getAllProjects();

  // Group projects by category
  const projectsByCategory = projects.reduce(
    (acc, project) => {
      const category = project.frontMatter.category;
      acc[category] ??= [];
      acc[category].push(project);
      return acc;
    },
    {} as Record<string, Project[]>,
  );

  // Get sorted category names (reverse alphabetical)
  const categories = Object.keys(projectsByCategory).sort((a, b) =>
    b.localeCompare(a),
  );

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-foreground font-jersey-10 mb-6 text-6xl leading-none md:text-7xl lg:text-[7rem]">
            Projects
          </h1>
          <p className="text-muted-foreground text-xl">
            A collection of things I&apos;ve built
          </p>
        </div>

        <div className="blur-list">
          {/* Projects by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-10">
              {/* Category Header */}
              <h2 className="text-foreground font-jersey-10 mb-4 text-4xl">
                {category}
              </h2>

              {/* Projects Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projectsByCategory[category]?.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center">
            <p className="text-foreground text-xl">No projects yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
