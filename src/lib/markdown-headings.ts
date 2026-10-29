import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownHeading {
  id: string;
  text: string;
  level: number;
}

type MarkdownNode = {
  type: string;
  value?: string;
  alt?: string | null;
  depth?: number;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, string> };
};

/** Returns the readable text of a heading, including image alternative text. */
function headingText(node: MarkdownNode): string {
  if (node.type === "image" || node.type === "imageReference")
    return node.alt ?? "";
  if (node.value !== undefined) return node.value;
  return node.children?.map(headingText).join("") ?? "";
}

/** Collects headings and assigns unique anchor IDs to their Markdown nodes. */
function collectHeadings(tree: MarkdownNode): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const usedIds = new Set<string>();

  /** Visits nested nodes in document order so duplicate anchors remain stable. */
  function walk(node: MarkdownNode) {
    if (node.type === "heading" && node.depth !== undefined) {
      const text = headingText(node);
      const slug =
        text
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s_-]/gu, "")
          .trim()
          .replace(/\s+/g, "-") || "section";
      const base = `heading-${slug}`;
      let id = base;
      let suffix = 1;
      while (usedIds.has(id)) id = `${base}-${suffix++}`;
      usedIds.add(id);
      node.data ??= {};
      node.data.hProperties = { ...node.data.hProperties, id };
      headings.push({ id, text, level: node.depth });
    }
    node.children?.forEach(walk);
  }
  walk(tree);
  return headings;
}

/** Extracts heading metadata using the same Markdown parser as the rendered content. */
export function extractMarkdownHeadings(markdown: string): MarkdownHeading[] {
  let headings: MarkdownHeading[] = [];
  /** Captures the parsed tree before React Markdown converts it to elements. */
  function collect() {
    return (tree: MarkdownNode) => {
      headings = collectHeadings(tree);
    };
  }
  ReactMarkdown({ remarkPlugins: [remarkGfm, collect], children: markdown });
  return headings;
}

/** Adds the same unique anchor IDs used by the table of contents to rendered headings. */
export function remarkHeadingIds() {
  return (tree: MarkdownNode) => {
    collectHeadings(tree);
  };
}
