"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, Github, Moon, Sun, Search, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-12 items-center justify-between px-4 lg:px-6">

          {/* Left: Menu button (mobile) + Logo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={onMenuClick}
            >
              <Menu className="h-4 w-4" />
            </Button>

            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-base"
            >
              📚 <span className="hidden sm:inline">Stack Docs</span>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border border-border/50",
                "bg-background/50 px-3 py-1.5 text-sm transition-colors",
                "hover:bg-muted/50 hover:border-border",
                "focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:ring-offset-2"
              )}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground flex-1 text-left">
                Hujjatlarni qidiring...
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Right: Version badge + Theme toggle + GitHub */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex text-xs px-2 py-0.5 bg-[#534AB7]/10 text-[#534AB7] border-[#534AB7]/20"
            >
              v1.0
            </Badge>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
              className="h-8 w-8"
              title="GitHub"
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