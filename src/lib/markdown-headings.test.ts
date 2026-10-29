import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { extractMarkdownHeadings, remarkHeadingIds } from "./markdown-headings";

describe("Markdown headings", () => {
  it("extracts formatted and setext headings while ignoring code", () => {
    expect(
      extractMarkdownHeadings(
        "## A *bold* [link](https://example.com)\n\nSubsection\n----------\n\n```md\n## Not a heading\n```",
      ),
    ).toEqual([
      { id: "heading-a-bold-link", text: "A bold link", level: 2 },
      { id: "heading-subsection", text: "Subsection", level: 2 },
    ]);
  });

  it("uses alternative text from reference-style images in headings", () => {
    expect(
      extractMarkdownHeadings("## ![Pizza logo][logo]\n\n[logo]: /logo.png"),
    ).toEqual([{ id: "heading-pizza-logo", text: "Pizza logo", level: 2 }]);
  });

  it("produces unique IDs for duplicates, collisions, and punctuation-only headings", () => {
    expect(
      extractMarkdownHeadings("## Café!\n## Café\n## Café-1\n## !\n## !").map(
        (heading) => heading.id,
      ),
    ).toEqual([
      "heading-café",
      "heading-café-1",
      "heading-café-1-1",
      "heading-section",
      "heading-section-1",
    ]);
  });

  it("assigns exactly the extracted IDs to rendered heading nodes", () => {
    const markdown = "## Same\n### Same\n## Another";
    const html = renderToStaticMarkup(
      createElement(
        ReactMarkdown,
        {
          remarkPlugins: [remarkGfm, remarkHeadingIds],
        },
        markdown,
      ),
    );
    for (const heading of extractMarkdownHeadings(markdown)) {
      expect(html).toContain(`id="${heading.id}"`);
    }
  });
});
