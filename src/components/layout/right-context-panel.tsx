"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Link2, Github, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  title: string
  level: number
}

interface RightContextPanelProps {
  className?: string
  repoUrl?: string
}

export function RightContextPanel({ className, repoUrl }: RightContextPanelProps) {
  const pathname = usePathname()
  const [tocItems, setTocItems] = React.useState<TocItem[]>([])
  const [activeId, setActiveId] = React.useState<string>("")

  // Extract TOC from page headings
  React.useEffect(() => {
    if (typeof document === 'undefined') return

    const headings = document.querySelectorAll('h1, h2, h3, h4')
    const items: TocItem[] = []

    headings.forEach((heading) => {
      if (heading.id) {
        items.push({
          id: heading.id,
          title: heading.textContent || "",
          level: parseInt(heading.tagName.charAt(1))
        })
      }
    })

    setTocItems(items)
  }, [pathname])

  // Track active heading on scroll
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const headings = tocItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element)

      // Find the heading closest to the top of the viewport
      let activeHeading = ""
      const scrollY = window.scrollY + 100 // Add some offset

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading.element && heading.element.offsetTop <= scrollY) {
          activeHeading = heading.id
          break
        }
      }

      setActiveId(activeHeading)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Run on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [tocItems])

  const copyPageLink = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return

    try {
      await navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const getGitHubUrl = () => {
    if (!repoUrl || typeof window === 'undefined') return "#"
    const cleanRepoUrl = repoUrl.replace("https://github.com/", "")
    const filePath = pathname.replace("/docs/", "docs/") + ".mdx"
    return `https://github.com/${cleanRepoUrl}/blob/main/${filePath}`
  }

  const getIssueUrl = () => {
    if (!repoUrl || typeof window === 'undefined') return "#"
    const cleanRepoUrl = repoUrl.replace("https://github.com/", "")
    const title = `Documentation issue: ${pathname}`
    const body = `**Page URL:** ${window.location.href}\n\n**Issue description:**\n\n[Describe the issue here]`
    return `https://github.com/${cleanRepoUrl}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
  }

  if (tocItems.length === 0) {
    return (
      <aside className={cn("w-35 flex-shrink-0", className)}>
        <div className="sticky top-20 space-y-6">
          <div className="space-y-2">
            <div className="h-px bg-border/50" />
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyPageLink}
                className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <Link2 className="h-3.5 w-3.5 mr-2" />
                Copy page link
              </Button>

              {repoUrl && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <a href={getGitHubUrl()} target="_blank" rel="noreferrer">
                      <Github className="h-3.5 w-3.5 mr-2" />
                      View on GitHub
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <a href={getIssueUrl()} target="_blank" rel="noreferrer">
                      <AlertTriangle className="h-3.5 w-3.5 mr-2" />
                      Report issue
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className={cn("w-35 flex-shrink-0", className)}>
      <div className="sticky top-20 space-y-6">
        {/* Table of Contents */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            On this page
          </h4>
          <nav className="space-y-0.5">
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "block transition-colors text-xs leading-relaxed",
                  "hover:text-foreground",
                  item.level === 1 && "font-medium",
                  item.level === 2 && "pl-3",
                  item.level === 3 && "pl-6",
                  item.level >= 4 && "pl-9",
                  activeId === item.id
                    ? "text-[#534AB7] font-medium"
                    : "text-muted-foreground"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  })
                }}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50" />

        {/* Quick Actions */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyPageLink}
            className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link2 className="h-3.5 w-3.5 mr-2" />
            Copy page link
          </Button>

          {repoUrl && (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <a href={getGitHubUrl()} target="_blank" rel="noreferrer">
                  <Github className="h-3.5 w-3.5 mr-2" />
                  View on GitHub
                </a>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <a href={getIssueUrl()} target="_blank" rel="noreferrer">
                  <AlertTriangle className="h-3.5 w-3.5 mr-2" />
                  Report issue
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}