import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "~/lib/utils";
import { toolDirectory } from "./tool-directory";

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="text-foreground font-jersey-10 mb-4 text-6xl leading-none md:text-7xl lg:text-[7rem]">
          Tools
        </h1>
        <p className="text-muted-foreground text-xl">
          Misc tools I&apos;ve built for my own use
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        {toolDirectory.map((tool, i) => (
          <Link
            key={tool.route}
            href={`/tools${tool.route}`}
            className="group block"
          >
            <div className="border-border/50 border-t py-10 last:border-b">
              <div
                className={cn(
                  "flex flex-col items-center gap-8 md:flex-row",
                  i % 2 !== 0 && "md:flex-row-reverse",
                )}
              >
                {/* Image */}
                <div className="border-border bg-background/40 w-full shrink-0 overflow-hidden rounded-xl border md:w-72">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="h-auto w-full"
                  />
                </div>

                {/* Text */}
                <div className="flex min-w-0 flex-1 flex-col gap-0">
                  <span className="text-primary/60 font-jersey-10 text-8xl leading-none select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-foreground font-jersey-10 text-4xl leading-none transition-colors group-hover:text-primary">
                    {tool.title}
                  </h2>
                  <div className="max-w-none text-foreground/80">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {tool.short_description}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
