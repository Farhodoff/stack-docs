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
      <SheetOverlay className="bg-background/80 backdrop-blur-sm" />
      <SheetContent
        side="top"
        className="h-[550px] w-full max-w-3xl mx-auto mt-[8vh] p-0 rounded-xl border border-border/60 shadow-2xl bg-background/95 backdrop-blur-md"
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Search Header */}
          <div className="border-b border-border/40 bg-gradient-to-r from-muted/20 to-muted/10">
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="relative">
                <Search className="h-5 w-5 text-[#534AB7]" />
                <div className="absolute inset-0 h-5 w-5 bg-[#534AB7] rounded-full opacity-20 animate-pulse" />
              </div>
              <input
                ref={inputRef}
                type="search"
                placeholder="Hujjatlarni qidiring..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/70 font-medium"
              />
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted/40 rounded-md px-2 py-1 border border-border/30">
                  <Command className="h-3 w-3" />
                  <span className="font-mono font-medium">K</span>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
            </div>
          </div>

          {/* Enhanced Results Area */}
          <div className="flex-1 overflow-hidden">
            {!query.trim() && (
              <div className="py-12 px-6 text-center">
                <div className="max-w-sm mx-auto">
                  <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground/80 mb-2">
                    Hujjatlarni qidiring
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    React, Node.js, CSS va boshqa texnologiyalar bo'yicha ma'lumot toping
                  </p>
                </div>
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <div className="py-12 px-6 text-center">
                <div className="max-w-sm mx-auto">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground/80 mb-2">
                    Natija topilmadi
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">"{query}"</span> uchun hech narsa topilmadi. Boshqa atama bilan qidiring.
                  </p>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="py-3 px-3 overflow-y-auto max-h-full">
                <div className="space-y-1">
                  {results.map((item, index) => (
                    <button
                      type="button"
                      key={item.slug}
                      onClick={() => handleResultClick(item.slug)}
                      className={cn(
                        "group w-full p-4 text-left rounded-lg transition-all duration-150 border",
                        "hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 hover:shadow-md hover:border-border/60",
                        "focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:ring-offset-1",
                        index === selectedIndex
                          ? "bg-gradient-to-r from-[#534AB7]/10 to-[#534AB7]/5 border-[#534AB7]/30 shadow-sm"
                          : "border-transparent hover:border-border/40"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={cn(
                              "p-1.5 rounded-md transition-colors",
                              index === selectedIndex
                                ? "bg-[#534AB7]/15 text-[#534AB7]"
                                : "bg-muted/60 text-muted-foreground group-hover:bg-[#534AB7]/10 group-hover:text-[#534AB7]"
                            )}>
                              <FileText className="h-3.5 w-3.5" />
                            </div>
                            <h3 className="font-semibold text-sm text-foreground/90 truncate leading-tight">
                              {item.title}
                            </h3>
                          </div>

                          <p className="text-xs text-muted-foreground/80 line-clamp-2 mb-3 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-2 flex-wrap">
                            {item.readTime && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/40 rounded-full px-2 py-1">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">{item.readTime} min</span>
                              </div>
                            )}
                            {item.difficulty && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs px-2 py-0.5 font-medium border",
                                  DIFFICULTY_COLORS[item.difficulty]
                                )}
                              >
                                {getDifficultyLabel(item.difficulty)}
                              </Badge>
                            )}
                            {item.category && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-[#534AB7]/10 text-[#534AB7] border border-[#534AB7]/20 font-medium"
                              >
                                {item.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="border-t border-border/40 bg-gradient-to-r from-muted/10 to-transparent px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <kbd className="pointer-events-none select-none rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-xs font-medium shadow-sm">↑</kbd>
                  <kbd className="pointer-events-none select-none rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-xs font-medium shadow-sm">↓</kbd>
                  <span className="text-xs text-muted-foreground font-medium">navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="pointer-events-none select-none rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-xs font-medium shadow-sm">↵</kbd>
                  <span className="text-xs text-muted-foreground font-medium">select</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="pointer-events-none select-none rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-xs font-medium shadow-sm">esc</kbd>
                  <span className="text-xs text-muted-foreground font-medium">close</span>
                </div>
              </div>
              <div className="text-xs font-medium">
                {results.length > 0 && (
                  <span className="text-[#534AB7]">{results.length} ta natija</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}