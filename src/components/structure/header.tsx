"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Pizza", href: "/pizza" },
  { label: "ROO", href: "https://redoxfordonline.com" },
];

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="relative z-20 w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <nav className="bg-background/40 hover:bg-background/60 border-primary/20 flex items-center gap-8 rounded-full border px-10 py-1 shadow-xs transition-all duration-300">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-jersey-10 text-2xl transition-colors",
                  isActive(item.href)
                    ? "text-primary hover:cursor-default"
                    : "text-foreground hover:text-primary/80",
                )}
                target={item.href.startsWith("http") ? "_blank" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
