/* eslint-disable @next/next/no-img-element */
import React from "react";
import type { Components } from "react-markdown";
import {
  CircleAlert,
  Info,
  Lightbulb,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";

import { cn } from "./utils";
import { AlertType, isAlertType, parseAlertPrefix } from "./markdown";

type MdastNode = {
  type: string;
  value?: string;
  children?: MdastNode[];
  data?: Record<string, unknown>;
};

function processBlockquoteNode(node: MdastNode) {
  if (node.type === "blockquote" && node.children) {
    const firstChild = node.children[0];
    if (firstChild?.type === "paragraph" && firstChild.children?.length) {
      const firstInline = firstChild.children[0];
      if (firstInline?.type === "text" && firstInline.value) {
        const parsed = parseAlertPrefix(firstInline.value);
        if (parsed) {
          node.data = node.data ?? {};
          node.data.hProperties = {
            ...(typeof node.data.hProperties === "object"
              ? node.data.hProperties
              : {}),
            "data-alert": parsed.type.toLowerCase(),
          };
          firstInline.value = parsed.rest;
          if (!firstInline.value) {
            firstChild.children.shift();
          }
          if (firstChild.children.length === 0) {
            node.children.shift();
          }
        }
      }
    }
  }
  if (node.children) {
    for (const child of node.children) {
      processBlockquoteNode(child);
    }
  }
}

export function remarkGithubAlerts() {
  return (tree: MdastNode) => {
    if (tree.children) {
      for (const node of tree.children) {
        processBlockquoteNode(node);
      }
    }
  };
}

const alertConfig: Record<
  AlertType,
  {
    label: string;
    Icon: React.ElementType;
    containerClass: string;
    headerClass: string;
    iconClass: string;
  }
> = {
  [AlertType.NOTE]: {
    label: "Note",
    Icon: Info,
    containerClass: "border-blue-500 bg-blue-500/10",
    headerClass: "text-blue-600 dark:text-blue-400",
    iconClass: "text-blue-500",
  },
  [AlertType.TIP]: {
    label: "Tip",
    Icon: Lightbulb,
    containerClass: "border-green-500 bg-green-500/10",
    headerClass: "text-green-600 dark:text-green-400",
    iconClass: "text-green-500",
  },
  [AlertType.IMPORTANT]: {
    label: "Important",
    Icon: CircleAlert,
    containerClass: "border-purple-500 bg-purple-500/10",
    headerClass: "text-purple-600 dark:text-purple-400",
    iconClass: "text-purple-500",
  },
  [AlertType.WARNING]: {
    label: "Warning",
    Icon: TriangleAlert,
    containerClass: "border-amber-500 bg-amber-500/10",
    headerClass: "text-amber-600 dark:text-amber-400",
    iconClass: "text-amber-500",
  },
  [AlertType.CAUTION]: {
    label: "Caution",
    Icon: OctagonAlert,
    containerClass: "border-red-500 bg-red-500/10",
    headerClass: "text-red-600 dark:text-red-400",
    iconClass: "text-red-500",
  },
};

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
    blockquote: ({ children, node, ...props }) => {
      const dataAlert = node?.properties?.["data-alert"];
      const alertType = isAlertType(dataAlert) ? dataAlert : undefined;
      const config = alertType ? alertConfig[alertType] : undefined;
      if (config) {
        const { label, Icon, containerClass, headerClass, iconClass } = config;
        return (
          <div
            className={cn(
              "my-4 rounded-lg border-l-4 px-4 py-3",
              containerClass,
            )}
          >
            <div
              className={cn(
                "mb-1 flex items-center gap-1.5 font-semibold",
                headerClass,
              )}
            >
              <Icon className={cn("size-4", iconClass)} />
              {label}
            </div>
            <div className="text-foreground [&>p:last-child]:mb-0">
              {children}
            </div>
          </div>
        );
      }

      return (
        <blockquote
          className={cn(
            "text-muted-foreground my-4 border-l-4 pl-4 italic",
            blockquoteBorderColor,
          )}
          {...props}
        >
          {children}
        </blockquote>
      );
    },
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
