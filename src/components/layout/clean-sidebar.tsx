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
      <nav className="space-y-1">
        {items.map((group, index) => {
          const isExpanded = expandedSections.has(group.category)
          const hasActiveItem = group.items.some(item =>
            pathname === `/docs/${item.slug}`
          )

          return (
            <div key={index}>
              <button
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
  )
}