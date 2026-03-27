import type { DocFrontmatter } from '@/lib/parseFrontmatter'

export type { DocFrontmatter }

export interface DocMetadata {
  slug: string
  filePath?: string
  title?: string
  description?: string
  frontmatter: DocFrontmatter
  lastModified: Date | string
}

export interface DocFormData {
  title: string
  description: string
  category: string
  order: number
  tags?: string[]
  content: string
}
