/**
 * Generate table of contents from markdown content
 * Extracts all headings and creates a hierarchical structure
 */
export interface TOCItem {
  id: string
  text: string
  level: number
  children?: TOCItem[]
}

/**
 * Parse markdown content and extract headings for TOC
 * @param content - Markdown content
 * @returns Array of TOC items
 */
export function generateTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const matches = Array.from(content.matchAll(headingRegex))
  
  const toc: TOCItem[] = []
  const stack: TOCItem[] = []
  
  for (const match of matches) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    
    const item: TOCItem = { id, text, level }
    
    // Find the correct parent
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      toc.push(item)
    } else {
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    }
    
    stack.push(item)
  }
  
  return toc
}

/**
 * Flatten TOC for simpler display
 * @param toc - Hierarchical TOC
 * @returns Flattened array of all items
 */
export function flattenTOC(toc: TOCItem[]): TOCItem[] {
  const result: TOCItem[] = []
  
  for (const item of toc) {
    result.push(item)
    if (item.children) {
      result.push(...flattenTOC(item.children))
    }
  }
  
  return result
}
