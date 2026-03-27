"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Github, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

import { SidebarNavGroup } from "./docs-sidebar";

interface NavbarProps {
  onMenuClick?: () => void;
  items?: SidebarNavGroup[];
}

export function Navbar({ onMenuClick, items }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        {/* Mobile menu button */}
        <MobileNav items={items} />

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <span className="text-primary">📚 Stack Docs</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link
            href="/docs/introduction/what-is-fullstack"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname?.startsWith("/docs")
                ? "text-primary"
                : "text-muted-foreground",
            )}
          >
            📖 Hujjatlar
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* GitHub link */}
          <Button variant="ghost" size="icon" asChild title="GitHub">
            <Link href="https://github.com/Farhodoff/stack-docs" target="_blank" rel="noreferrer">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
