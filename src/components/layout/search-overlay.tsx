"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, Clock, Command, X, ChevronRight } from "lucide-react"

// ... (rest of the imports)
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
        { name: "title", weight: 3 },
        { name: "tags", weight: 2 },
        { name: "description", weight: 1 },
        { name: "category", weight: 0.8 },
        { name: "content", weight: 0.5 },
      ],
      threshold: 0.35,
      includeMatches: true,
      ignoreLocation: true,
    })
  }, [index])

  const results = React.useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).slice(0, 8).map(result => result.item)
  }, [query, fuse])

  // Get recommended docs (latest 4)
  const recommended = React.useMemo(() => {
    return [...index].slice(0, 4)
  }, [index])

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

    const currentResults = query.trim() ? results : recommended
    if (!currentResults.length) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, currentResults.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case "Enter":
          e.preventDefault()
          if (currentResults[selectedIndex]) {
            router.push(`/docs/${currentResults[selectedIndex].slug}`)
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
  }, [open, results, recommended, query, selectedIndex, router, onOpenChange])

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
      <SheetOverlay className="bg-background/40 backdrop-blur-md" />
      <SheetContent
        side="top"
        className="h-[600px] w-full max-w-2xl mx-auto mt-[10vh] p-0 rounded-2xl border border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-background/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Enhanced Search Header */}
          <div className="relative group/input border-b border-border/30">
            <div className="flex items-center gap-4 px-6 h-16">
              <Search className={cn(
                "h-5 w-5 transition-colors duration-300",
                query ? "text-primary" : "text-muted-foreground/50"
              )} />
              <input
                ref={inputRef}
                type="search"
                placeholder="Nima o'rganamiz bugun?..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground/40 font-medium"
              />
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/30 rounded-lg px-2 py-1 border border-border/30">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 rounded-full">
                    <X className="h-4 w-4 text-muted-foreground/50" />
                  </Button>
                </SheetClose>
              </div>
            </div>
            {query && (
              <div className="absolute bottom-0 left-0 h-[2px] bg-primary animate-in slide-in-from-left duration-300 w-full" />
            )}
          </div>

          {/* Enhanced Results Area */}
          <div className="flex-1 overflow-y-auto scrollbar-none py-4">
            {!query.trim() && (
              <div className="px-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Tavsiya etilgan darslar
                  </h3>
                </div>
                <div className="grid gap-2">
                  {recommended.map((item, index) => (
                    <button
                      key={item.slug}
                      onClick={() => handleResultClick(item.slug)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group text-left border border-transparent",
                        index === selectedIndex 
                          ? "bg-primary/5 border-primary/20 shadow-sm" 
                          : "hover:bg-muted/30"
                      )}
                    >
                      <div className="h-10 w-10 rounded-lg bg-background border border-border/50 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                        {item.category?.split(' ')[0] || "📄"}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-0.5">{item.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-all duration-200",
                        index === selectedIndex ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                      )} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in-95">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                  <Search className="h-16 w-16 text-muted-foreground/20 relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-foreground/80 mb-2">
                  Hech narsa topilmadi
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  <span className="font-bold text-primary">"{query}"</span> bo'yicha hech qanday hujjat topilmadi. Boshqa kalit so'zlar bilan qidiring.
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="px-3 space-y-1 animate-in fade-in duration-300">
                {results.map((item, index) => (
                  <button
                    key={item.slug}
                    onClick={() => handleResultClick(item.slug)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "flex flex-col w-full p-4 rounded-xl transition-all duration-200 group text-left border relative",
                      index === selectedIndex
                        ? "bg-primary/[0.03] border-primary/30 shadow-[0_4px_20px_rgba(var(--primary),0.05)]"
                        : "border-transparent hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border border-border/50",
                        index === selectedIndex ? "bg-primary/10 text-primary border-primary/20" : "bg-muted/50 text-muted-foreground/70"
                      )}>
                        {item.category || "Ma'lumot"}
                      </div>
                      <h3 className="font-bold text-sm text-foreground/90 leading-none">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground/80 line-clamp-1 pl-0.5">
                      {item.description}
                    </p>
                    {index === selectedIndex && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider animate-in fade-in slide-in-from-right-2">
                        O'qish <ChevronRight className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="h-12 border-t border-border/30 bg-muted/10 px-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <kbd className="rounded border border-border/40 bg-background px-1.5 py-0.5">↑↓</kbd>
                <span>Navigatsiya</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="rounded border border-border/40 bg-background px-1.5 py-0.5">↵</kbd>
                <span>Tanlash</span>
              </div>
            </div>
            {results.length > 0 && (
              <div className="text-primary/60">
                {results.length} ta natija topildi
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}