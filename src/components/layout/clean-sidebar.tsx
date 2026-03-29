"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SidebarNavItem {
  title: string
  slug: string
}

export interface SidebarNavGroup {
  category: string
  items: SidebarNavItem[]
}

interface CleanSidebarProps {
  items: SidebarNavGroup[]
  className?: string
}

export function CleanSidebar({ items, className }: CleanSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(items.map(group => group.category))
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

  // Auto-expand section containing current page
  React.useEffect(() => {
    const currentGroup = items.find(group =>
      group.items.some(item => pathname === `/docs/${item.slug}`)
    )

    if (currentGroup && !expandedSections.has(currentGroup.category)) {
      setExpandedSections(prev => new Set([...prev, currentGroup.category]))
    }
  }, [pathname, items, expandedSections])

  return (
    <div className={cn("w-full", className)}>
      <nav className="space-y-2">
        {items.map((group, index) => {
          const isExpanded = expandedSections.has(group.category)
          const hasActiveItem = group.items.some(item =>
            pathname === `/docs/${item.slug}`
          )

          return (
            <div key={index} className="group">
              <button
                type="button"
                onClick={() => toggleSection(group.category)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5",
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
                          className={cn(
                            "group/item block rounded-md px-3 py-2 text-sm transition-all duration-150",
                            "relative overflow-hidden",
                            isActive
                              ? "bg-gradient-to-r from-[#534AB7] to-[#534AB7]/90 text-white font-medium shadow-md border border-[#534AB7]"
                              : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/40 hover:shadow-sm border border-transparent hover:border-border/30"
                          )}
                        >
                          <span className="relative z-10 leading-relaxed tracking-wide">
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
  )
}