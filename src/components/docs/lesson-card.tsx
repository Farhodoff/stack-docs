'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Clock, BookOpen } from 'lucide-react'

interface LessonCardProps {
  slug: string
  title: string
  description?: string
  category: string
  order?: number
  tags?: string[]
  readTime?: number // minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  progress?: number // 0-100
  className?: string
}

// Category colors
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'html-css-js': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  html: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  css: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  javascript: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
  react: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  nodejs: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
  database: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  frontend: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
  backend: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

const getDifficultyLabel = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner':
      return '🟢 Boshlang\'ich'
    case 'intermediate':
      return '🟡 O\'rta'
    case 'advanced':
      return '🔴 Murakkab'
    default:
      return null
  }
}

const getReadTimeLabel = (minutes?: number) => {
  if (!minutes) return null
  if (minutes < 5) return '5 min'
  if (minutes < 10) return '10 min'
  if (minutes < 15) return '15 min'
  if (minutes < 20) return '20 min'
  return `${minutes} min`
}

export function LessonCard({
  slug,
  title,
  description,
  category,
  order,
  tags,
  readTime,
  difficulty,
  progress,
  className,
}: LessonCardProps) {
  const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS['html-css-js']

  return (
    <Link href={`/docs/${slug}`} className="block group">
      <Card
        className={cn(
          'relative overflow-hidden h-full transition-all duration-300',
          'hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1',
          'border border-border/50 bg-card/50 backdrop-blur-sm',
          className
        )}
      >
        {/* Left accent line */}
        <div className={cn('absolute left-0 top-0 bottom-0 w-1', (categoryStyle.bg || 'bg-slate-500').replace('bg-', 'bg-').replace('-50', '-500'))} />
        
        <CardHeader className="pb-3 pt-6 px-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {order && (
                <span className={cn('text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-muted/50 border border-border/50', categoryStyle.text)}>
                  Dars {order}
                </span>
              )}
              {difficulty && DIFFICULTY_COLORS[difficulty] && (
                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border border-border/50', DIFFICULTY_COLORS[difficulty].replace('bg-', 'bg-opacity-10 bg-'))}>
                  {getDifficultyLabel(difficulty)}
                </span>
              )}
            </div>
            <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </CardTitle>
          </div>

          {description && (
            <CardDescription className="mt-3 text-sm leading-relaxed line-clamp-2 text-muted-foreground/80">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-5">
          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-[11px] font-medium text-muted-foreground/60">
            {readTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{getReadTimeLabel(readTime)} o&apos;qish</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="uppercase tracking-tight">{category}</span>
            </div>
          </div>

          {/* Progress (Subtle) */}
          {progress !== undefined && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-muted-foreground/50">Progress</span>
                <span className={categoryStyle.text}>{progress}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1 overflow-hidden">
                <div
                  className={cn('h-full transition-all duration-500 ease-out', (categoryStyle.bg || 'bg-slate-500').replace('-50', '-500'))}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer - Floating Arrow */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground uppercase tracking-tighter">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="text-sm">→</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
