import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define the project front matter type
interface ProjectFrontMatter {
  title: string;
  slug: string;
  category: string;
  original_link?: string;
  start_date: string;
  completed_date?: string;
  active_development: boolean;
  short_description: string;
  google_play_url?: string;
  apple_store_url?: string;
  github_url?: string;
  project_url?: string;
  has_privacy_policy: boolean;
  has_data_delete: boolean;
  logo?: string;
  screenshots?: string[];
  features?: string[];
  technologies?: string[];
}

interface Project {
  slug: string;
  frontMatter: ProjectFrontMatter;
  content: string;
}

interface PolicyDocument {
  content: string;
}

const PROJECTS_DIR = path.join(process.cwd(), "cms", "projects");
const PRIVACY_POLICY_DIR = path.join(
  process.cwd(),
  "cms",
  "projects",
  "privacy-policy",
);
const DATA_DELETE_DIR = path.join(
  process.cwd(),
  "cms",
  "projects",
  "data-delete-policy",
);

// Helper function to read all projects
function getAllProjects(): Project[] {
  try {
    const files = fs.readdirSync(PROJECTS_DIR);
    const projects = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const slug = file.replace(/\.md$/, "");
        const filePath = path.join(PROJECTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
          slug,
          frontMatter: data as ProjectFrontMatter,
          content,
        };
      });

    // Sort by category (reverse alphabetically), then by start_date (newest first) within each category
    projects.sort((a, b) => {
      const categoryCompare = b.frontMatter.category.localeCompare(
        a.frontMatter.category,
      );
      if (categoryCompare !== 0) return categoryCompare;

      // Within same category, sort by start_date (newest first)
      const dateA = new Date(a.frontMatter.start_date);
      const dateB = new Date(b.frontMatter.start_date);
      return dateB.getTime() - dateA.getTime();
    });

    return projects;
  } catch (error) {
    console.error("Error reading projects:", error);
    return [];
  }
}

// Helper function to get a single project by slug
function getProjectBySlug(slug: string): Project | null {
  try {
    const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontMatter: data as ProjectFrontMatter,
      content,
    };
  } catch (error) {
    console.error("Error reading project:", error);
    return null;
  }
}

// Helper function to get privacy policy by project slug
function getPrivacyPolicy(slug: string): PolicyDocument | null {
  try {
    const filePath = path.join(PRIVACY_POLICY_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    return {
      content: fileContent,
    };
  } catch (error) {
    console.error("Error reading privacy policy:", error);
    return null;
  }
}

// Helper function to get data delete policy by project slug
function getDataDeletePolicy(slug: string): PolicyDocument | null {
  try {
    const filePath = path.join(DATA_DELETE_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    return {
      content: fileContent,
    };
  } catch (error) {
    console.error("Error reading data delete policy:", error);
    return null;
  }
}

export const projectRouter = createTRPCRouter({
  getAllProjects: publicProcedure.query(() => {
    return getAllProjects();
  }),

  getProjectBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      const project = getProjectBySlug(input.slug);
      if (!project) {
        throw new Error(`Project not found: ${input.slug}`);
      }
      return project;
    }),

  getPrivacyPolicy: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      return getPrivacyPolicy(input.slug);
    }),

  getDataDeletePolicy: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      return getDataDeletePolicy(input.slug);
    }),
});
