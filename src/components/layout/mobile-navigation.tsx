"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export interface SidebarNavItem {
  title: string
  slug: string
}

export interface SidebarNavGroup {
  category: string
  items: SidebarNavItem[]
}

interface MobileNavigationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: SidebarNavGroup[]
}

export function MobileNavigation({ open, onOpenChange, items }: MobileNavigationProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set()
  )

  const toggleSection = (category: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  // Auto-expand section containing current page when mobile nav opens
  React.useEffect(() => {
    if (open) {
      const currentGroup = items.find(group =>
        group.items.some(item => pathname === `/docs/${item.slug}`)
      )

      if (currentGroup) {
        setExpandedSections(prev => new Set([...prev, currentGroup.category]))
      }
    }
  }, [open, pathname, items])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="border-b border-border/40 bg-gradient-to-r from-muted/20 to-muted/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-lg font-bold text-foreground/90">
                📚
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Stack Docs
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-muted/50 rounded-full transition-all duration-200"
              onClick={() => onOpenChange(false)}
              title="Close navigation"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <nav className="space-y-2">
            {items.map((group, index) => {
              const isExpanded = expandedSections.has(group.category)
              const hasActiveItem = group.items.some(item =>
                pathname === `/docs/${item.slug}`
              )

              // Dynamic animation delay for staggered entrance - inline style necessary
              // eslint-disable-next-line react/no-inline-styles
              return (
                <div key={index} className="group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <button
                    type="button"
                    onClick={() => toggleSection(group.category)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-4 py-3",
                      "text-sm font-semibold transition-all duration-200",
                      "hover:bg-muted/60 hover:shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:ring-offset-1",
                      hasActiveItem
                        ? "text-[#534AB7] bg-[#534AB7]/8 shadow-sm border border-[#534AB7]/20"
                        : "text-foreground/90 border border-transparent"
                    )}
                  >
                    <span className="text-left font-medium tracking-wide">{group.category}</span>
                    <div className={cn(
                      "transition-transform duration-200 ease-in-out",
                      isExpanded ? "rotate-0" : "-rotate-90"
                    )}>
                      <ChevronDown className={cn(
                        "h-4 w-4 flex-shrink-0 transition-colors duration-200",
                        hasActiveItem ? "text-[#534AB7]/70" : "text-muted-foreground/70"
                      )} />
                    </div>
                  </button>

                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}>
                    {group.items?.length > 0 && (
                      <div className="ml-4 mt-2 space-y-1 border-l border-border/40 pl-4">
                        {group.items.map((item, itemIndex) => {
                          const href = `/docs/${item.slug}`
                          const isActive = pathname === href

                          return (
                            <Link
                              key={itemIndex}
                              href={href}
                              onClick={() => onOpenChange(false)}
                              className={cn(
                                "group/item block rounded-md px-3 py-2.5 text-sm transition-all duration-150",
                                "relative overflow-hidden",
                                isActive
                                  ? "bg-gradient-to-r from-[#534AB7] to-[#534AB7]/90 text-white font-medium shadow-md border border-[#534AB7]"
                                  : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/40 hover:shadow-sm border border-transparent hover:border-border/30"
                              )}
                            >
                              <span className="relative z-10 leading-relaxed tracking-wide font-medium">
                                {item.title}
                              </span>
                              {!isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}