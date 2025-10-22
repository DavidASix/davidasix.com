import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define the pizza post front matter type
interface PizzaFrontMatter {
  "purchase-date": string;
  "pizza-shop": string;
  rating: number;
  "better-than-ginos": boolean;
  tldr: string;
}

interface PizzaPost {
  slug: string;
  frontMatter: PizzaFrontMatter;
  content: string;
}

const PIZZA_DIR = path.join(process.cwd(), "cms", "pizza");

// Helper function to read all pizza posts
function getAllPizzaPosts(): PizzaPost[] {
  try {
    const files = fs.readdirSync(PIZZA_DIR);
    const posts = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const slug = file.replace(/\.md$/, "");
        const filePath = path.join(PIZZA_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
          slug,
          frontMatter: data as PizzaFrontMatter,
          content,
        };
      });

    // Sort by purchase-date (most recent first)
    posts.sort((a, b) => {
      const dateA = new Date(a.frontMatter["purchase-date"]);
      const dateB = new Date(b.frontMatter["purchase-date"]);
      return dateB.getTime() - dateA.getTime();
    });

    return posts;
  } catch (error) {
    console.error("Error reading pizza posts:", error);
    return [];
  }
}

// Helper function to get a single post by slug
function getPizzaPostBySlug(slug: string): PizzaPost | null {
  try {
    const filePath = path.join(PIZZA_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontMatter: data as PizzaFrontMatter,
      content,
    };
  } catch (error) {
    console.error("Error reading pizza post:", error);
    return null;
  }
}

export const pizzaRouter = createTRPCRouter({
  getAllPosts: publicProcedure.query(() => {
    return getAllPizzaPosts();
  }),

  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      const post = getPizzaPostBySlug(input.slug);
      if (!post) {
        throw new Error(`Pizza post not found: ${input.slug}`);
      }
      return post;
    }),
});
