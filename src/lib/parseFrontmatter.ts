import matter from 'gray-matter'

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
  try {
    const { data } = matter(content)
    if (Object.keys(data).length === 0) return null
    return data as DocFrontmatter
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
  try {
    const { content: body } = matter(content)
    return body.trim()
  } catch {
    return content // Return original if parsing fails
  }
}
