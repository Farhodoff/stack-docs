export interface DocFrontmatter {
  title: string
  description: string
  category?: string
  order?: number
  tags?: string[]
  draft?: boolean
}

export interface DocMetadata {
  slug: string
  filePath: string
  frontmatter: DocFrontmatter
  lastModified: Date
}

export interface DocFormData {
  title: string
  description: string
  category: string
  order: number
  tags: string[]
  content: string
}