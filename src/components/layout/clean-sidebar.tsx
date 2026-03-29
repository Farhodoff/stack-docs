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
  icon?: string | null
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
    <div className={cn("w-full flex flex-col gap-6", className)}>
      <nav className="space-y-6">
        {items.map((group, index) => {
          const isExpanded = expandedSections.has(group.category)
          const hasActiveItem = group.items.some(item =>
            pathname === `/docs/${item.slug}`
          )

          // Try to extract icon from name if not provided (e.g. "🚀 Introduction")
          const categoryName = group.category || "General"
          const categoryDisplay = categoryName.replace(/^[^\w\s]*\s*/, "")
          const icon = group.icon || categoryName.match(/^[^\w\s]*/)?.[0] || "📁"

          return (
            <div key={index} className="space-y-1.5">
              <button
                type="button"
                onClick={() => toggleSection(group.category)}
                className={cn(
                  "flex w-full items-center justify-between group px-2 py-1.5 rounded-md transition-colors",
                  "text-xs font-bold uppercase tracking-wider text-muted-foreground/70 hover:text-foreground",
                  hasActiveItem && "text-primary/90"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">{icon}</span>
                  <span>{categoryDisplay}</span>
                </div>
                <ChevronRight className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  isExpanded ? "rotate-90" : "rotate-0"
                )} />
              </button>

              <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isExpanded ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  <div className="ml-2.5 space-y-0.5 border-l border-border/60 pl-4 py-1">
                    {group.items?.map((item, itemIndex) => {
                      const href = `/docs/${item.slug}`
                      const isActive = pathname === href

                      return (
                        <Link
                          key={itemIndex}
                          href={href}
                          className={cn(
                            "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-all duration-200 relative",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold shadow-[0_0_15px_rgba(var(--primary),0.1)] border-r-2 border-primary"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                        >
                          <span className="relative z-10 leading-relaxed truncate">
                            {item.title}
                          </span>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </nav>
    </div>
  )
}