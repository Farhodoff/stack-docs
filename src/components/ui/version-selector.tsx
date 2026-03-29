"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface VersionInfo {
  version: string
  label: string
  isCurrent: boolean
  released?: string
  isLatest?: boolean
}

const versions: VersionInfo[] = [
  {
    version: "v1.2.0",
    label: "v1.2.0 (Latest)",
    isCurrent: true,
    released: "2024-03-29",
    isLatest: true
  },
  {
    version: "v1.1.0",
    label: "v1.1.0",
    isCurrent: false,
    released: "2024-02-15"
  },
  {
    version: "v1.0.5",
    label: "v1.0.5",
    isCurrent: false,
    released: "2024-01-20"
  },
  {
    version: "v1.0.0",
    label: "v1.0.0",
    isCurrent: false,
    released: "2023-12-01"
  }
]

export function VersionSelector() {
  const currentVersion = versions.find(v => v.isCurrent) || versions[0]

  const handleVersionChange = (version: VersionInfo) => {
    // In a real app, this would handle version switching
    // For now, we'll just log it
    console.log("Version selected:", version.version)

    // You could implement actual version switching logic here:
    // - Update URL params
    // - Redirect to versioned docs
    // - Update context/state
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <Badge
            variant="secondary"
            className="text-xs px-1.5 py-0 bg-[#534AB7]/10 text-[#534AB7] border-[#534AB7]/20 hover:bg-[#534AB7]/15"
          >
            {currentVersion.version}
          </Badge>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 p-1"
        sideOffset={8}
      >
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b border-border mb-1">
          Version
        </div>

        {versions.map((version) => (
          <DropdownMenuItem
            key={version.version}
            className="flex items-center justify-between px-2 py-2 text-sm cursor-pointer"
            onClick={() => handleVersionChange(version)}
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {version.version}
                </span>
                {version.isLatest && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-1.5 py-0 bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
                  >
                    Latest
                  </Badge>
                )}
              </div>
              {version.released && (
                <span className="text-xs text-muted-foreground">
                  {new Date(version.released).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>

            {version.isCurrent && (
              <Check className="h-4 w-4 text-[#534AB7]" />
            )}
          </DropdownMenuItem>
        ))}

        <div className="border-t border-border mt-1 pt-1">
          <DropdownMenuItem
            className="text-xs text-muted-foreground px-2 py-1.5 cursor-pointer"
            onClick={() => window.open('https://github.com/Farhodoff/stack-docs/releases', '_blank')}
          >
            View all releases →
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}