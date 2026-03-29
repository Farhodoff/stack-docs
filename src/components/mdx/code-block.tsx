"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
  title?: string
}

export function CodeBlock({ children, language, className, title }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  return (
    <div className={cn("group relative", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border border-border rounded-t-lg">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
        </div>
      )}

      <div className="relative">
        <pre className={cn(
          "overflow-x-auto p-4 bg-slate-950 text-slate-50 border border-border",
          title ? "rounded-b-lg" : "rounded-lg",
          "font-mono text-sm leading-relaxed"
        )}>
          <code className={language ? `language-${language}` : ""}>{children}</code>
        </pre>

        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className={cn(
            "absolute top-3 right-3 h-8 w-8",
            "bg-slate-800/80 hover:bg-slate-700 border border-slate-600",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-slate-300" />
          )}
        </Button>
      </div>
    </div>
  )
}

interface CalloutProps {
  children: React.ReactNode
  type?: "info" | "warning" | "error" | "success"
  title?: string
  className?: string
}

export function Callout({ children, type = "info", title, className }: CalloutProps) {
  const styles = {
    info: {
      container: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/30",
      title: "text-blue-900 dark:text-blue-100",
      content: "text-blue-800 dark:text-blue-200"
    },
    warning: {
      container: "border-l-amber-500 bg-amber-50 dark:bg-amber-950/30",
      title: "text-amber-900 dark:text-amber-100",
      content: "text-amber-800 dark:text-amber-200"
    },
    error: {
      container: "border-l-red-500 bg-red-50 dark:bg-red-950/30",
      title: "text-red-900 dark:text-red-100",
      content: "text-red-800 dark:text-red-200"
    },
    success: {
      container: "border-l-green-500 bg-green-50 dark:bg-green-950/30",
      title: "text-green-900 dark:text-green-100",
      content: "text-green-800 dark:text-green-200"
    }
  }

  const style = styles[type]

  return (
    <div className={cn(
      "border-l-4 p-4 my-6 rounded-r-lg",
      style.container,
      className
    )}>
      {title && (
        <h5 className={cn("font-medium mb-2", style.title)}>
          {title}
        </h5>
      )}
      <div className={cn("text-sm leading-relaxed", style.content)}>
        {children}
      </div>
    </div>
  )
}