import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { DocFrontmatter, DocMetadata } from '@/types/admin'

export function parseFrontmatter(content: string): DocFrontmatter | null {
  try {
    const { data } = matter(content)
    if (Object.keys(data).length === 0) return null
    return data as DocFrontmatter
  } catch {
    return null
  }
}

export function extractBody(content: string): string {
  try {
    const { content: body } = matter(content)
    return body.trim()
  } catch {
    return content.trim()
  }
}

export function getDocMetadata(filePath: string): DocMetadata | null {
  if (!fs.existsSync(filePath)) return null
  
  const content = fs.readFileSync(filePath, 'utf-8')
  const frontmatter = parseFrontmatter(content)
  
  if (!frontmatter) return null
  
  const stats = fs.statSync(filePath)
  const relativePath = path.relative(path.join(process.cwd(), 'docs'), filePath)
  const slug = relativePath
    .replace(/\.mdx$/, '')
    .split(path.sep)
    .join('/')

  return {
    slug,
    filePath,
    frontmatter,
    lastModified: stats.mtime,
  }
}

export function getAllDocsMetadata(): DocMetadata[] {
  const docsDir = path.join(process.cwd(), 'docs')
  const metadata: DocMetadata[] = []

  function walkDir(dir: string) {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name)
      
      if (file.isDirectory()) {
        walkDir(fullPath)
      } else if (file.isFile() && file.name.endsWith('.mdx')) {
        const meta = getDocMetadata(fullPath)
        if (meta) {
          metadata.push(meta)
        }
      }
    }
  }

  walkDir(docsDir)
  return metadata.sort((a, b) => (a.frontmatter.order || 0) - (b.frontmatter.order || 0))
}