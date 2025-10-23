"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

interface PageBackgroundProps {
  children: ReactNode;
}

// Configure background colors for different routes
const routeColors: Record<string, string> = {
  "/pizza": "bg-background/35",
  // Add more routes as needed
};

const defaultColor = "bg-gradient-to-b from-foreground/15 to-foreground/35";

export function PageBackground({ children }: PageBackgroundProps) {
  const pathname = usePathname();
  // Sort routes by length (descending) to match most specific routes first
  const matchedRoute = Object.keys(routeColors)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname.startsWith(route));

  const backgroundColor = matchedRoute
    ? routeColors[matchedRoute]
    : defaultColor;

  return (
    <div
      className={cn(
        "relative z-10 flex min-h-screen flex-col",
        backgroundColor,
      )}
    >
      {children}
    </div>
  );
}
