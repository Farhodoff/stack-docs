import fs from 'fs'
import path from 'path'
import { DocFrontmatter, DocFormData } from '@/types/admin'

const DOCS_DIR = path.join(process.cwd(), 'docs')

export function ensureDocsDir() {
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true })
  }
}

export function getCategoryDir(category: string): string {
  const categoryDir = path.join(DOCS_DIR, category)
  ensureDocsDir()
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true })
  }
  return categoryDir
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function writeDocFile(
  slug: string,
  category: string,
  frontmatter: DocFrontmatter,
  content: string
): string {
  const categoryDir = getCategoryDir(category)
  const filePath = path.join(categoryDir, `${slug}.mdx`)

  const frontmatterString = `---
title: "${frontmatter.title}"
description: "${frontmatter.description}"
category: "${frontmatter.category}"
order: ${frontmatter.order}
${frontmatter.tags ? `tags:\n  - ${frontmatter.tags.join('\n  - ')}` : ''}
---

`

  const fullContent = frontmatterString + content

  fs.writeFileSync(filePath, fullContent, 'utf-8')
  
  return filePath
}

export function updateDocFile(
  filePath: string,
  frontmatter: DocFrontmatter,
  content: string
): void {
  const frontmatterString = `---
title: "${frontmatter.title}"
description: "${frontmatter.description}"
category: "${frontmatter.category}"
order: ${frontmatter.order}
${frontmatter.tags ? `tags:\n  - ${frontmatter.tags.join('\n  - ')}` : ''}
---

`

  const fullContent = frontmatterString + content
  fs.writeFileSync(filePath, fullContent, 'utf-8')
}

export function deleteDocFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

export function getAllDocFiles(): Array<{ filePath: string; slug: string }> {
  const docs: Array<{ filePath: string; slug: string }> = []

  function walkDir(dir: string, baseDir: string) {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name)
      
      if (file.isDirectory()) {
        walkDir(fullPath, baseDir)
      } else if (file.isFile() && file.name.endsWith('.mdx')) {
        const relativePath = path.relative(baseDir, fullPath)
        const slug = relativePath
          .replace(/\.mdx$/, '')
          .split(path.sep)
          .join('/')
        
        docs.push({ filePath: fullPath, slug })
      }
    }
  }

  walkDir(DOCS_DIR, DOCS_DIR)
  return docs
}