import fs from 'fs'
import path from 'path'
import { parse } from 'yaml'
import { DocFrontmatter, DocMetadata } from '@/types/admin'

export function parseFrontmatter(content: string): DocFrontmatter | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match) return null
  
  try {
    const yamlContent = match[1]
    return parse(yamlContent) as DocFrontmatter
  } catch {
    return null
  }
}

export function extractBody(content: string): string {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\n?/
  return content.replace(frontmatterRegex, '').trim()
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