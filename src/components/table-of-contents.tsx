"use client";

import { useEffect, useState } from "react";
import type { MarkdownHeading } from "~/lib/markdown-headings";
import { cn } from "~/lib/utils";

/** Renders heading links and highlights the section currently in view. */
export function TableOfContents({
  headings,
  color = "primary",
}: {
  headings: MarkdownHeading[];
  color?: "primary" | "pizza";
}) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    /** Selects the current section, including the last section at the bottom of the page. */
    const updateActive = () => {
      let current = "";
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 120)
          current = heading.id;
      }
      const lastHeading = headings.at(-1);
      const lastElement =
        lastHeading && document.getElementById(lastHeading.id);
      if (
        lastHeading &&
        lastElement &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2 &&
        lastElement.getBoundingClientRect().top < window.innerHeight
      ) {
        current = lastHeading.id;
      }
      setActiveId(current ? current : (headings[0]?.id ?? ""));
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [headings]);

  if (headings.length === 0) return null;
  const accent = color === "pizza" ? "text-amber-700" : "text-primary";
  const minLevel = Math.min(...headings.map((heading) => heading.level));
  const links = (
    <ul className={cn("text-sm", accent)}>
      {headings.map((heading, index) => {
        const indent = (heading.level - minLevel) * 12;
        const previousHeading = headings[index - 1];
        const previousIndent = previousHeading
          ? (previousHeading.level - minLevel) * 12
          : indent;
        const step = previousIndent - indent;

        return (
          <li
            key={heading.id}
            className={cn("relative py-1.5 pl-3", step !== 0 && "pt-[18px]")}
            style={{ marginLeft: `${indent}px` }}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute bottom-0 left-0 border-l-2 border-current",
                step === 0 ? "top-0" : "top-3",
              )}
            />
            {step !== 0 && (
              <svg
                aria-hidden="true"
                className="absolute top-0 overflow-visible"
                style={{ left: `${Math.min(0, step) + 1}px` }}
                width={Math.abs(step)}
                height="12"
              >
                <line
                  x1={step > 0 ? Math.abs(step) : 0}
                  y1="0"
                  x2={step > 0 ? 0 : Math.abs(step)}
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? "location" : undefined}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                activeId === heading.id && accent,
              )}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav aria-label="Table of contents" className="min-w-0">
      <div className="hidden lg:block">
        <p className="mb-5 font-semibold">Contents</p>
        {links}
      </div>
      <details className="lg:hidden">
        <summary className="cursor-pointer font-semibold">Contents</summary>
        <div className="mt-4">{links}</div>
      </details>
    </nav>
  );
}
