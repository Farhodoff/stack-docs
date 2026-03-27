import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'

interface CalloutProps {
  children: ReactNode
  title?: string
  variant?: 'default' | 'note' | 'tip' | 'warning' | 'danger'
  className?: string
}

const icons = {
  default: Info,
  note: Info,
  tip: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
}

const variants = {
  default: 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/30',
  note: 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/30',
  tip: 'border-green-500/50 bg-green-50 dark:bg-green-950/30',
  warning: 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/30',
  danger: 'border-red-500/50 bg-red-50 dark:bg-red-950/30',
}

export function Callout({ 
  children, 
  title, 
  variant = 'default',
  className 
}: CalloutProps) {
  const Icon = icons[variant]

  return (
    <div
      className={cn(
        'my-6 flex gap-4 rounded-lg border-l-4 p-4',
        variants[variant],
        className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && (
          <p className="mb-2 font-semibold">{title}</p>
        )}
        <div className="text-sm opacity-90 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  )
}

// Export specific variants for convenience
export const Note = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout variant="note" title="Note" {...props} />
)

export const Tip = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout variant="tip" title="Tip" {...props} />
)

export const Warning = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout variant="warning" title="Warning" {...props} />
)

export const Danger = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout variant="danger" title="Danger" {...props} />
)
