/* eslint-disable @next/next/no-img-element */
import type { Components } from "react-markdown";
import { cn } from "./utils";

export interface MarkdownComponentOptions {
  h2?: string;
  h3?: string;
  a?: string;
  aHover?: string;
  blockquoteBorder?: string;
  inlineCode?: string;
}

export function createMarkdownComponents(
  options: MarkdownComponentOptions = {},
): Components {
  const {
    h2: h2Color,
    h3: h3Color,
    a: aColor = "text-primary",
    aHover: aHoverColor = "hover:text-primary/80",
    blockquoteBorder: blockquoteBorderColor = "border-primary",
    inlineCode: inlineCodeColor = "text-primary",
  } = options;

  return {
    img: ({ src, alt, ...props }) => {
      if (!src || typeof src !== "string") return null;

      // Handle local images (local/image-name.webp -> /cms/images/image-name.webp)
      const imageSrc = src.startsWith("local/")
        ? `/cms/images/${src.replace("local/", "")}`
        : src;

      return (
        <span className="my-6 block">
          <img
            src={imageSrc}
            alt={alt ?? ""}
            className="mx-auto max-h-[500px] rounded-lg object-contain shadow-lg"
            style={{ maxWidth: "100%" }}
            {...props}
          />
          {alt && (
            <span className="text-muted-foreground mt-2 block text-center text-sm italic">
              {alt}
            </span>
          )}
        </span>
      );
    },
    h1: ({ children, ...props }) => (
      <h1 className="text-foreground mb-6 text-4xl font-bold" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className={cn("mt-8 mb-4 text-3xl font-bold", h2Color)} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className={cn("mt-6 mb-3 text-2xl font-bold", h3Color)} {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="text-foreground mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="text-foreground mb-4 ml-6 list-disc space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="text-foreground mb-4 ml-6 list-decimal space-y-2"
        {...props}
      >
        {children}
      </ol>
    ),
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className={cn("underline", aColor, aHoverColor)}
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className={cn(
          "text-muted-foreground my-4 border-l-4 pl-4 italic",
          blockquoteBorderColor,
        )}
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code
            className={cn(
              "bg-muted rounded px-1 py-0.5 font-mono text-sm",
              inlineCodeColor,
            )}
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code
          className="bg-muted text-foreground my-4 block rounded p-4 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
  };
}
