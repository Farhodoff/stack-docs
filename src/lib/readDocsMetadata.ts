import fs from "fs";
import path from "path";
import { parseFrontmatter, DocFrontmatter } from "./parseFrontmatter";

/**
 * Document metadata interface
 */
export interface DocMetadata {
  slug: string;
  title: string;
  description: string;
  category?: string;
  order?: number;
  tags?: string[];
  filePath: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  readTime?: number;
}

// Ensure we always have an absolute path to the docs directory
const DOCS_DIR = path.join(process.cwd(), "docs");

/**
 * Get all documentation files recursively from the docs directory
 * @param dir - Absolute directory path to search in
 * @returns Array of document metadata
 */
export function getAllDocs(dir: string = DOCS_DIR): DocMetadata[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });
  const docs: DocMetadata[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Recursively get docs from subdirectories using absolute path
      const subDocs = getAllDocs(fullPath);
      docs.push(...subDocs);
    } else if (file.isFile() && file.name.endsWith(".mdx")) {
      // Read and parse the MDX file
      const content = fs.readFileSync(fullPath, "utf-8");
      const frontmatter = parseFrontmatter(content);

      // Ignore drafts if that field is somehow defined
      if (frontmatter && !(frontmatter as any).draft) {
        // Generate a clean slug relative to the base docs directory
        const relativePath = path.relative(DOCS_DIR, fullPath);
        const slug = relativePath
          .replace(/\.mdx$/, "")
          .split(path.sep)
          .join("/");

        docs.push({
          slug,
          title: frontmatter.title || "Untitled",
          description: frontmatter.description || "",
          category: frontmatter.category,
          order: frontmatter.order || 0,
          tags: frontmatter.tags || [],
          filePath: fullPath,
          difficulty: (frontmatter as any).difficulty as 'beginner' | 'intermediate' | 'advanced' | undefined,
          readTime: (frontmatter as any).readTime as number | undefined,
        });
      }
    }
  }

  // Sort by order, then by title
  return docs.sort((a, b) => {
    if ((a.order || 0) !== (b.order || 0)) {
      return (a.order || 0) - (b.order || 0);
    }
    return a.title.localeCompare(b.title);
  });
}

/**
 * Get doc by slug
 * @param slug - The doc slug (e.g., 'introduction/what-is-fullstack')
 * @returns Document metadata or null
 */
export function getDocBySlug(slug: string): DocMetadata | null {
  const docs = getAllDocs();
  return docs.find((doc) => doc.slug === slug) || null;
}

/**
 * Normalize category name for comparison (lowercase and trim)
 */
function normalizeCategory(category?: string): string {
  return (category || "Other").trim().toLowerCase();
}

/**
 * Get docs by category (case-insensitive)
 * @param category - Category name
 * @returns Array of document metadata in that category
 */
export function getDocsByCategory(category: string): DocMetadata[] {
  const docs = getAllDocs();
  const normalizedSearch = normalizeCategory(category);
  return docs.filter((doc) => normalizeCategory(doc.category) === normalizedSearch);
}

/**
 * Get all categories with their docs (case-insensitive grouping)
 * @returns Object with category names as keys and docs as values
 */
export function getCategories(): Record<string, DocMetadata[]> {
  const docs = getAllDocs();
  const categories: Record<string, DocMetadata[]> = {};
  // Map to store normalized keys (lowercase) to first-encountered display name
  const normalizedToOriginal: Record<string, string> = {};

  docs.forEach((doc) => {
    const rawCategory = (doc.category || "Other").trim();
    const normalized = normalizeCategory(rawCategory);

    if (!normalizedToOriginal[normalized]) {
      normalizedToOriginal[normalized] = rawCategory;
      categories[rawCategory] = [];
    }

    const targetCategory = normalizedToOriginal[normalized];
    categories[targetCategory].push(doc);
  });

  return categories;
}

/**
 * Get navigation structure from docs
 * This generates the sidebar menu automatically
 * @returns Navigation items grouped by category
 */
export function getNavigationItems() {
  const categories = getCategories();

  const sortedCategories = Object.entries(categories)
    .map(([categoryName, docs]) => {
      // Find minimum order and get potential category icon from first doc
      const minOrder = Math.min(...docs.map(d => d.order || 999));
      
      // Since docs are already grouped, any doc in the list has the same normalized category
      const firstDoc = docs[0];
      const icon = firstDoc?.category?.split(' ')[0] || null;

      return {
        category: categoryName,
        icon: icon,
        minOrder,
        items: docs.map((doc) => ({
          slug: doc.slug,
          title: doc.title,
          description: doc.description,
          order: doc.order,
        })),
      };
    })
    .sort((a, b) => a.minOrder - b.minOrder);

  return sortedCategories.map(cat => ({
    category: cat.category,
    icon: cat.icon,
    items: cat.items.sort((a, b) => (a.order || 0) - (b.order || 0)).map(item => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
    }))
  }));
}

/**
 * Get previous and next docs for pagination (CATEGORY-AWARE)
 * @param currentSlug - Current document slug
 * @param category - Category to filter by (case-insensitive)
 * @returns Previous and next doc metadata within the same category
 */
export function getPrevNextDocs(currentSlug: string, category?: string) {
  let docs = getAllDocs();
  
  // Filter by category if provided
  if (category) {
    const normalizedSearch = normalizeCategory(category);
    docs = docs.filter((doc) => normalizeCategory(doc.category) === normalizedSearch);
  }
  
  const currentIndex = docs.findIndex((doc) => doc.slug === currentSlug);

  return {
    prev: currentIndex > 0 ? docs[currentIndex - 1] : null,
    next: currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null,
  };
}
