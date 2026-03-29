"use client"

import * as React from "react"
import { CleanHeader } from "@/components/layout/clean-header"
import { MobileNavigation } from "@/components/layout/mobile-navigation"

interface SidebarNavItem {
  title: string
  slug: string
}

interface SidebarNavGroup {
  category: string
  items: SidebarNavItem[]
}

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

interface ClientLayoutProps {
  children: React.ReactNode
  navigationItems: SidebarNavGroup[]
  searchIndex: SearchDocument[]
}

export function ClientLayout({ children, navigationItems, searchIndex }: ClientLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  return (
    <div className="relative flex min-h-screen flex-col">
      <CleanHeader
        onMenuClick={() => setMobileNavOpen(true)}
        searchIndex={searchIndex}
      />
      <main className="flex-1">{children}</main>

      <MobileNavigation
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        items={navigationItems}
      />

      <footer className="border-t border-border/50 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Stack Docs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}