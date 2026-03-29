"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Link2, Github, AlertTriangle, Copy, Check, Hash } from "lucide-react"
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
  const [copied, setCopied] = React.useState(false)

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

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Run on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [tocItems])

  const copyPageLink = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return

    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
      <aside className={cn("w-40 flex-shrink-0", className)}>
        <div className="sticky top-20 space-y-6">
          <div className="space-y-4">
            <div className="h-px bg-gradient-to-r from-border/60 to-transparent" />
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyPageLink}
                className="w-full justify-start h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 rounded-lg transition-all duration-200 group"
                title="Copy page link"
              >
                <div className="flex items-center gap-2">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5 group-hover:text-[#534AB7] transition-colors" />
                  )}
                  <span className="font-medium">Copy link</span>
                </div>
              </Button>

              {repoUrl && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 rounded-lg transition-all duration-200 group"
                    title="View source on GitHub"
                  >
                    <a href={getGitHubUrl()} target="_blank" rel="noreferrer">
                      <Github className="h-3.5 w-3.5 mr-2 group-hover:text-[#534AB7] transition-colors" />
                      <span className="font-medium">View source</span>
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 rounded-lg transition-all duration-200 group"
                    title="Report documentation issue"
                  >
                    <a href={getIssueUrl()} target="_blank" rel="noreferrer">
                      <AlertTriangle className="h-3.5 w-3.5 mr-2 group-hover:text-[#534AB7] transition-colors" />
                      <span className="font-medium">Report issue</span>
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
    <aside className={cn("w-40 flex-shrink-0", className)}>
      <div className="sticky top-20 space-y-6">
        {/* Enhanced Table of Contents */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-[#534AB7]" />
            <h4 className="text-sm font-semibold text-foreground/90 tracking-wide">
              On this page
            </h4>
          </div>

          <nav className="space-y-1">
            {tocItems.map((item) => (
              <div key={item.id} className="relative group">
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block py-1.5 transition-all duration-200 text-xs leading-relaxed rounded-md",
                    "hover:bg-gradient-to-r hover:from-muted/30 hover:to-transparent",
                    "relative",
                    item.level === 1 && "font-semibold pl-3",
                    item.level === 2 && "pl-4",
                    item.level === 3 && "pl-6",
                    item.level >= 4 && "pl-8",
                    activeId === item.id
                      ? "text-[#534AB7] font-semibold bg-gradient-to-r from-[#534AB7]/10 to-transparent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(item.id)
                    if (element) {
                      const headerOffset = 80
                      const elementPosition = element.offsetTop
                      const offsetPosition = elementPosition - headerOffset

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                      })
                    }
                  }}
                >
                  {/* Active indicator */}
                  {activeId === item.id && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-[#534AB7] rounded-full" />
                  )}

                  {/* Level indicators for nested items */}
                  {item.level > 1 && (
                    <div className={cn(
                      "absolute top-1/2 transform -translate-y-1/2 w-1 h-1 rounded-full",
                      activeId === item.id ? "bg-[#534AB7]" : "bg-muted-foreground/30",
                      item.level === 2 && "left-2",
                      item.level === 3 && "left-4",
                      item.level >= 4 && "left-6"
                    )} />
                  )}

                  <span className="relative z-10 font-medium">
                    {item.title}
                  </span>
                </a>
              </div>
            ))}
          </nav>
        </div>

        {/* Enhanced Divider */}
        <div className="h-px bg-gradient-to-r from-border/60 via-border/40 to-transparent" />

        {/* Enhanced Quick Actions */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyPageLink}
            className="w-full justify-start h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 rounded-lg transition-all duration-200 group"
            title="Copy page link to clipboard"
          >
            <div className="flex items-center gap-2">
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5 group-hover:text-[#534AB7] transition-colors" />
              )}
              <span className="font-medium">
                {copied ? "Copied!" : "Copy link"}
              </span>
            </div>
          </Button>

          {repoUrl && (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 rounded-lg transition-all duration-200 group"
                title="View source code on GitHub"
              >
                <a href={getGitHubUrl()} target="_blank" rel="noreferrer">
                  <Github className="h-3.5 w-3.5 mr-2 group-hover:text-[#534AB7] transition-colors" />
                  <span className="font-medium">View source</span>
                </a>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 rounded-lg transition-all duration-200 group"
                title="Report an issue with this page"
              >
                <a href={getIssueUrl()} target="_blank" rel="noreferrer">
                  <AlertTriangle className="h-3.5 w-3.5 mr-2 group-hover:text-[#534AB7] transition-colors" />
                  <span className="font-medium">Report issue</span>
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}