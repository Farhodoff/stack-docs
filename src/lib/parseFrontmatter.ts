import { parse } from 'yaml'

/**
 * Frontmatter interface for documentation files
 * Each .mdx file should have YAML frontmatter with these fields
 */
export interface DocFrontmatter {
  title: string
  description: string
  category?: string
  order?: number
  tags?: string[]
  draft?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  readTime?: number
}

/**
 * Parse YAML frontmatter from MDX content
 * @param content - The raw MDX file content
 * @returns Parsed frontmatter object
 */
export function parseFrontmatter(content: string): DocFrontmatter | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return null
  }
  
  try {
    const yamlContent = match[1]
    const parsed = parse(yamlContent) as DocFrontmatter
    return parsed
  } catch (error) {
    console.error('Error parsing frontmatter:', error)
    return null
  }
}

/**
 * Extract the body content (without frontmatter) from MDX
 * @param content - The raw MDX file content
 * @returns Content without frontmatter
 */
export function extractBody(content: string): string {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\n?/
  return content.replace(frontmatterRegex, '')
}
