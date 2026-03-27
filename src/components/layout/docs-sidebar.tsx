"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export interface SidebarNavItem {
  title: string
  slug: string
}

export interface SidebarNavGroup {
  category: string
  items: SidebarNavItem[]
}

export interface DocsSidebarProps {
  items: SidebarNavGroup[]
  className?: string
}

export function DocsSidebar({ items, className }: DocsSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("w-full pb-12", className)}>
      {items.map((group, index) => (
        <div key={index} className="pb-6">
          <h4 className="mb-2 rounded-md px-2 py-1 text-sm font-semibold text-foreground">
            {group.category}
          </h4>
          {group.items?.length > 0 && (
            <ul className="grid grid-flow-row auto-rows-max text-sm">
              {group.items.map((item, itemIndex) => {
                const href = `/docs/${item.slug}`
                const isActive = pathname === href

                return (
                  <li key={itemIndex}>
                    <Link
                      href={href}
                      className={cn(
                        "group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 transition-colors hover:underline",
                        isActive
                          ? "font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
