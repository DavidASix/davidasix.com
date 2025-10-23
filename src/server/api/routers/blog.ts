import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define the blog post front matter type
interface BlogFrontMatter {
  title: string;
  original_link?: string;
  publish_date: string;
  subtitle?: string;
  header_image?: string;
}

interface BlogPost {
  slug: string;
  frontMatter: BlogFrontMatter;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "cms", "blog");

// Helper function to read all blog posts
function getAllBlogPosts(): BlogPost[] {
  try {
    const files = fs.readdirSync(BLOG_DIR);
    const posts = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const slug = file.replace(/\.md$/, "");
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
          slug,
          frontMatter: data as BlogFrontMatter,
          content,
        };
      });

    // Sort by publish_date (most recent first)
    posts.sort((a, b) => {
      const dateA = new Date(a.frontMatter.publish_date);
      const dateB = new Date(b.frontMatter.publish_date);
      return dateB.getTime() - dateA.getTime();
    });

    return posts;
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

// Helper function to get a single post by slug
function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontMatter: data as BlogFrontMatter,
      content,
    };
  } catch (error) {
    console.error("Error reading blog post:", error);
    return null;
  }
}

export const blogRouter = createTRPCRouter({
  getAllPosts: publicProcedure.query(() => {
    return getAllBlogPosts();
  }),

  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      const post = getBlogPostBySlug(input.slug);
      if (!post) {
        throw new Error(`Blog post not found: ${input.slug}`);
      }
      return post;
    }),
});
