'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface TabProps {
  label: string
  children: React.ReactNode
  disabled?: boolean
}

interface TabsComponentProps {
  tabs: TabProps[]
  defaultIndex?: number
}

export function Tabs({ tabs, defaultIndex = 0 }: TabsComponentProps) {
  const [activeTab, setActiveTab] = React.useState(defaultIndex)

  return (
    <div className="my-6 w-full">
      <div className="flex overflow-x-auto border-b">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => setActiveTab(index)}
            disabled={tab.disabled}
            className={cn(
              'rounded-none border-b-2 px-4 py-2 font-medium transition-colors',
              activeTab === index
                ? 'border-primary text-primary'
                : 'border-transparent hover:border-muted hover:text-foreground',
              index === 0 && 'ml-auto'
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="py-4">
        {tabs[activeTab]?.children}
      </div>
    </div>
  )
}

export function Tab({ children }: TabProps) {
  return <>{children}</>
}
