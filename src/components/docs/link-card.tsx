import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface LinkCardProps {
  href: string
  title: string
  description?: string
  icon?: React.ReactNode
  external?: boolean
  className?: string
}

export function LinkCard({ 
  href, 
  title, 
  description,
  icon,
  external = false,
  className 
}: LinkCardProps) {
  const ExternalIcon = external ? ExternalLink : null
  
  return (
    <Link href={href} passHref>
      <Card 
        className={cn(
          'group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1',
          className
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {icon}
                </div>
              )}
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
            </div>
            {external && ExternalIcon && (
              <ExternalIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          {description && (
            <CardDescription className="mt-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        {external && (
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Opens in new tab →
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
