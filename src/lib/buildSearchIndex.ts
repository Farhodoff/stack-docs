import fs from 'fs'
import path from 'path'
import { parseFrontmatter, extractBody } from './parseFrontmatter'

/**
 * Search document interface for Fuse.js
 */
export interface SearchDocument {
  slug: string
  title: string
  description: string
  category?: string
  tags?: string[]
  content: string
  filePath: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  readTime?: number
}

/**
 * Build search index from all documentation files
 * @param dir - Relative directory to process (relative to process.cwd())
 * @returns Array of search documents
 */
export function buildSearchIndex(dir: string = 'docs'): SearchDocument[] {
  const baseDocsDir = path.join(process.cwd(), 'docs')
  const currentDirPath = path.join(process.cwd(), dir)
  
  if (!fs.existsSync(currentDirPath)) {
    return []
  }
  
  const files = fs.readdirSync(currentDirPath, { withFileTypes: true })
  const documents: SearchDocument[] = []
  
  for (const file of files) {
    const fullPath = path.join(currentDirPath, file.name)
    
    if (file.isDirectory()) {
      // Recursively process subdirectories using the relative path from process.cwd()
      const relativeToCwd = path.relative(process.cwd(), fullPath)
      const subDocs = buildSearchIndex(relativeToCwd)
      documents.push(...subDocs)
    } else if (file.isFile() && file.name.endsWith('.mdx')) {
      // Read and parse the MDX file
      const content = fs.readFileSync(fullPath, 'utf-8')
      const frontmatter = parseFrontmatter(content)
      
      if (frontmatter && !frontmatter.draft) {
        // Generate slug relative to the base 'docs' directory
        const relativeToDocs = path.relative(baseDocsDir, fullPath)
        const slug = relativeToDocs
          .replace(/\.mdx$/, '')
          .split(path.sep)
          .join('/')
        
        // Extract plain text content (strip markdown)
        const body = extractBody(content)
        const plainTextContent = body
          .replace(/```[\s\S]*?```/g, '') // Remove code blocks
          .replace(/<[^>]+>/g, '') // Remove HTML tags
          .replace(/[#*_~`]/g, '') // Remove markdown symbols
          .replace(/\n+/g, ' ') // Replace newlines with spaces
          .trim()
        
        documents.push({
          slug,
          title: frontmatter.title || 'Untitled',
          description: frontmatter.description || '',
          category: frontmatter.category,
          tags: frontmatter.tags || [],
          content: plainTextContent.slice(0, 5000), // Limit content length
          filePath: fullPath,
          difficulty: (frontmatter as any).difficulty,
          readTime: (frontmatter as any).readTime,
        })
      }
    }
  }
  
  return documents
}
