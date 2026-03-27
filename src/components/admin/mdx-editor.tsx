'use client'

import { forwardRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { cn } from '@/lib/utils'

interface MDXEditorProps {
  value: string
  onChange: (value: string) => void
  initialValue?: string
  height?: number
}

export const MDXEditor = forwardRef<HTMLDivElement, MDXEditorProps>(
  ({ value, onChange, initialValue = '', height = 400 }, ref) => {
    return (
      <div ref={ref} data-color-mode="light" className="w-full">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={height}
          preview="live"
          hideToolbar={false}
          enableScroll={true}
          visibleDragbar={true}
          className={cn(
            'min-h-[400px] rounded-md border',
            ' [&_.w-md-editor-toolbar]:border-b',
            'dark:[&_.w-md-editor]:bg-background',
            'dark:[&_.w-md-editor-preview]:bg-muted'
          )}
        />
      </div>
    )
  }
)

MDXEditor.displayName = 'MDXEditor'