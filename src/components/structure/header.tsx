"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Pizza", href: "/pizza" },
  { label: "Projects", href: "/projects" },
  { label: "ROO", href: "https://redoxfordonline.com" },
];

function DesktopNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="bg-background/40 hover:bg-background/60 border-primary/20 hidden items-center gap-8 rounded-full border px-10 py-1 shadow-xs transition-all duration-300 md:flex">
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
  );
}

function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/40 hover:bg-background/60 rounded-full"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="top"
          className="bg-background/70 flex h-screen w-screen items-center justify-center border-none backdrop-blur-sm"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <nav className="flex flex-col items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "font-jersey-10 text-5xl transition-colors",
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
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function Header() {
  return (
    <header className="relative z-20 w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <DesktopNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
