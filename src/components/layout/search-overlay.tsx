"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, Clock, Command, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetClose, SheetOverlay } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Fuse from "fuse.js"
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

interface SearchOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  index: SearchDocument[]
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const getDifficultyLabel = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'Boshlang\'ich'
    case 'intermediate':
      return 'O\'rta'
    case 'advanced':
      return 'Murakkab'
    default:
      return null
  }
}

export function SearchOverlay({ open, onOpenChange, index }: SearchOverlayProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const fuse = React.useMemo(() => {
    return new Fuse(index, {
      keys: [
        { name: "title", weight: 2 },
        { name: "description", weight: 1.5 },
        { name: "tags", weight: 1.2 },
        { name: "category", weight: 1 },
        { name: "content", weight: 0.5 },
      ],
      threshold: 0.3,
      includeMatches: true,
    })
  }, [index])

  const results = React.useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).slice(0, 8).map(result => result.item)
  }, [query, fuse])

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Handle keyboard navigation
  React.useEffect(() => {
    if (typeof document === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case "Enter":
          e.preventDefault()
          if (results[selectedIndex]) {
            router.push(`/docs/${results[selectedIndex].slug}`)
            onOpenChange(false)
          }
          break
        case "Escape":
          onOpenChange(false)
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, results, selectedIndex, router, onOpenChange])

  // Reset selected index when query changes
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleResultClick = (slug: string) => {
    router.push(`/docs/${slug}`)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetOverlay />
      <SheetContent side="top" className="h-[500px] w-full max-w-2xl mx-auto mt-[10vh] p-0 rounded-lg">
        <div className="flex flex-col h-full">
          <div className="border-b border-border/50">
            <div className="flex items-center gap-3 px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="search"
                placeholder="Hujjatlarni qidiring..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {query.trim() && results.length === 0 && (
              <div className="py-6 px-4 text-center text-sm text-muted-foreground">
                "{query}" uchun natija topilmadi
              </div>
            )}

            {results.length > 0 && (
              <div className="py-2">
                {results.map((item, index) => (
                  <button
                    type="button"
                    key={item.slug}
                    onClick={() => handleResultClick(item.slug)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors",
                      index === selectedIndex && "bg-muted/80"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                          <h3 className="font-medium text-sm truncate">{item.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          {item.readTime && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {item.readTime} min
                            </div>
                          )}
                          {item.difficulty && (
                            <Badge variant="outline" className={cn("text-xs px-1.5 py-0", DIFFICULTY_COLORS[item.difficulty])}>
                              {getDifficultyLabel(item.difficulty)}
                            </Badge>
                          )}
                          {item.category && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border/50 px-4 py-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="pointer-events-none select-none rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">↑</kbd>
                  <kbd className="pointer-events-none select-none rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">↓</kbd>
                  <span>navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="pointer-events-none select-none rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">↵</kbd>
                  <span>select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="pointer-events-none select-none rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">esc</kbd>
                  <span>close</span>
                </div>
              </div>
              <div className="text-muted-foreground">
                {results.length > 0 && (
                  <span>{results.length} ta natija</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}