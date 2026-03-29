"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, Github, Moon, Sun, Search, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VersionSelector } from "@/components/ui/version-selector"
import { SearchOverlay } from "./search-overlay"
import { cn } from "@/lib/utils"

interface SearchDocument {
  slug: string
  title: string
  description: string
  category?: string
  tags?: string[]
  content: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  readTime?: number
}

interface CleanHeaderProps {
  onMenuClick?: () => void
  searchIndex?: SearchDocument[]
}

export function CleanHeader({ onMenuClick, searchIndex = [] }: CleanHeaderProps) {
  const [searchOpen, setSearchOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Handle CMD+K keyboard shortcut
  React.useEffect(() => {
    if (typeof document === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/85">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">

          {/* Left: Menu button (mobile) + Logo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 hover:bg-muted/50"
              onClick={onMenuClick}
            >
              <Menu className="h-4 w-4" />
            </Button>

            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-base hover:opacity-80 transition-opacity"
            >
              📚
              <span className="hidden sm:inline bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Stack Docs
              </span>
            </Link>
          </div>

          {/* Center: Enhanced Search Bar */}
          <div className="flex-1 max-w-lg mx-6">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg border border-border/60",
                "bg-muted/20 px-4 py-2 text-sm transition-all duration-200",
                "hover:bg-muted/40 hover:border-border/80 hover:shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:ring-offset-1",
                "dark:bg-muted/10 dark:hover:bg-muted/20"
              )}
            >
              <Search className="h-4 w-4 text-muted-foreground group-hover:text-foreground/80 transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground/80 flex-1 text-left transition-colors">
                Hujjatlarni qidiring...
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground/70 bg-muted/30 rounded px-1.5 py-0.5 border border-border/30 group-hover:bg-muted/50 transition-colors">
                <Command className="h-3 w-3" />
                <span className="font-medium">K</span>
              </div>
            </button>
          </div>

          {/* Right: Version selector + Theme toggle + GitHub */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <VersionSelector />
            </div>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-muted/50"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-9 w-9 hover:bg-muted/50"
              title="View on GitHub"
            >
              <Link
                href="https://github.com/Farhodoff/stack-docs"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <SearchOverlay
        open={searchOpen}
        onOpenChange={setSearchOpen}
        index={searchIndex}
      />
    </>
  )
}