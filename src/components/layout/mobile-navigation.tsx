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
        <SheetHeader className="border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-left">Navigation</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {items.map((group, index) => {
              const isExpanded = expandedSections.has(group.category)
              const hasActiveItem = group.items.some(item =>
                pathname === `/docs/${item.slug}`
              )

              return (
                <div key={index}>
                  <button
                    type="button"
                    onClick={() => toggleSection(group.category)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2",
                      "text-sm font-medium transition-colors",
                      "hover:bg-muted/50",
                      hasActiveItem
                        ? "text-[#534AB7] bg-[#534AB7]/5"
                        : "text-foreground"
                    )}
                  >
                    <span className="text-left leading-relaxed">{group.category}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && group.items?.length > 0 && (
                    <div className="ml-3 mt-1 space-y-0.5">
                      {group.items.map((item, itemIndex) => {
                        const href = `/docs/${item.slug}`
                        const isActive = pathname === href

                        return (
                          <Link
                            key={itemIndex}
                            href={href}
                            onClick={() => onOpenChange(false)}
                            className={cn(
                              "block rounded-md px-3 py-1.5 text-sm transition-colors leading-relaxed",
                              isActive
                                ? "bg-[#534AB7] text-white font-medium shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                          >
                            {item.title}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}