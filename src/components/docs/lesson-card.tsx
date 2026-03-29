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
    <Link href={`/docs/${slug}`}>
      <Card
        className={cn(
          'group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-l-4',
          categoryStyle.border,
          categoryStyle.bg,
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {order && (
                  <span className={cn('text-xs font-bold px-2 py-1 rounded-full', categoryStyle.text)}>
                    Dars {order}
                  </span>
                )}
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </CardTitle>
            </div>
          </div>

          {description && (
            <CardDescription className="mt-2 line-clamp-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {readTime && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {getReadTimeLabel(readTime)}
              </div>
            )}
            {difficulty && (
              <Badge variant="outline" className={DIFFICULTY_COLORS[difficulty]}>
                {getDifficultyLabel(difficulty)}
              </Badge>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Progress Tracker */}
          {progress !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  O'rganish davomiyligi
                </span>
                <span className={cn('font-semibold', categoryStyle.text)}>
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                {/* Dynamic progress width - inline style necessary for percentage calculation */}
                {/* eslint-disable-next-line react/forbid-dom-props */}
                {/* webhint:disable no-inline-styles */}
                <div
                  className={cn('h-full transition-all duration-300', categoryStyle.bg)}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className={cn('text-xs font-medium', categoryStyle.text)}>
              {category.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
              O'qish →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
