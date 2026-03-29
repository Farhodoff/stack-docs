"use server";

import { revalidatePath } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import {
  isSupabaseAvailable,
  createDocInSupabase,
  updateDocInSupabase,
  deleteDocInSupabase
} from "@/lib/supabase";

const docsDir = path.join(process.cwd(), "docs");
const categoriesJsonPath = path.join(docsDir, "config", "categories.json");

// Check if we're in production (Vercel)
const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
const useSupabase = isProduction && isSupabaseAvailable();

// Schema for document creation/update
const docSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  order: z.coerce.number().int().nonnegative("Order must be a positive number"),
  tags: z.array(z.string()).default([]),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]).default("draft"),
});

// Schema for category creation/update
const categorySchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  order: z.number().int().nonnegative(),
  icon: z.string().max(2).optional(),
});

export type DocFormData = z.infer<typeof docSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;

/**
 * Update document status (draft/published)
 */
export async function updateDocStatusAction(slug: string, status: "draft" | "published") {
  try {
    const doc = await getDocBySlugAction(slug);
    if (!doc) {
      return { error: "Document not found" };
    }

    const filePath = path.join(process.cwd(), doc.filePath);
    const content = await fs.readFile(filePath, "utf-8");

    // Extract existing frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return { error: "Invalid frontmatter format" };
    }

    const existingFrontmatter = frontmatterMatch[1];
    
    // Update or add status field
    let newFrontmatter = existingFrontmatter;
    if (existingFrontmatter.includes("status:")) {
      newFrontmatter = existingFrontmatter.replace(
        /status:\s*["']?(draft|published)["']?/,
        `status: "${status}"`
      );
    } else {
      // Add status after title
      newFrontmatter = newFrontmatter.replace(
        /(title:\s*["']?.+?["']?)/,
        `$1\nstatus: "${status}"`
      );
    }

    const body = content.replace(/^---\n[\s\S]*?\n---\n/, "");
    const newContent = `---\n${newFrontmatter}\n---\n\n${body}`;

    await fs.writeFile(filePath, newContent);

    // Revalidate the docs route
    revalidatePath("/docs");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error updating document status:", error);
    return { error: "Failed to update document status" };
  }
}

/**
 * Get all documents metadata
 */
export async function getAllDocsAction() {
  try {
    const files = await fs.readdir(docsDir, { recursive: true });
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const docs = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(docsDir, file);
        const content = await fs.readFile(filePath, "utf-8");

        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return null;

        const frontmatter = frontmatterMatch[1];
        const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
        const descMatch = frontmatter.match(
          /description:\s*["']?([^"'\n]+)["']?/,
        );
        const categoryMatch = frontmatter.match(
          /category:\s*["']?([^"'\n]+)["']?/,
        );
        const orderMatch = frontmatter.match(/order:\s*(\d+)/);
        const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
        const statusMatch = frontmatter.match(/status:\s*["']?(draft|published)["']?/);

        // Get last modified time
        const stats = await fs.stat(filePath);

        return {
          slug: (file as string).replace(".mdx", "").replace(/\//g, "-"),
          filePath: file,
          title: titleMatch?.[1]?.trim() || "Untitled",
          description: descMatch?.[1]?.trim() || "",
          category: categoryMatch?.[1]?.trim() || "uncategorized",
          order: parseInt(orderMatch?.[1] || "0"),
          tags: tagsMatch
            ? tagsMatch[1].split(",").map((t: string) => t.trim())
            : [],
          status: (statusMatch?.[1] as "draft" | "published") || "draft",
          lastModified: stats.mtime,
        };
      }),
    );

    return docs
      .filter((doc) => doc !== null)
      .sort((a, b) => (a?.order || 0) - (b?.order || 0));
  } catch (error) {
    console.error("Error reading docs:", error);
    return [];
  }
}

/**
 * Get a single document by slug
 */
export async function getDocBySlugAction(slug: string) {
  if (!slug) return null;
  try {
    // Convert slug to file path (slug uses / separators like: "html-css-js/01-introduction")
    const filePath = path.join(docsDir, `${slug}.mdx`);

    try {
      await fs.access(filePath);
      return await readDocFile(filePath);
    } catch {
      return null;
    }
  } catch (error) {
    console.error("Error reading document:", error);
    return null;
  }
}

/**
 * Helper function to read and parse a document file
 */
async function readDocFile(filePath: string) {
  const content = await fs.readFile(filePath, "utf-8");

  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
  const descMatch = frontmatter.match(/description:\s*["']?([^"'\n]+)["']?/);
  const categoryMatch = frontmatter.match(/category:\s*["']?([^"'\n]+)["']?/);
  const orderMatch = frontmatter.match(/order:\s*(\d+)/);
  const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
  const statusMatch = frontmatter.match(/status:\s*["']?(draft|published)["']?/);

  // Extract body (everything after frontmatter)
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, "");

  const stats = await fs.stat(filePath);
  const relativePath = path.relative(process.cwd(), filePath);

  // Generate slug relative to docs directory with forward slashes
  const relativeToDocsDir = path.relative(docsDir, filePath);
  const slug = relativeToDocsDir
    .replace(/\.mdx$/, "")
    .split(path.sep)
    .join("/");

  return {
    slug: slug,
    filePath: relativePath,
    frontmatter: {
      title: titleMatch?.[1]?.trim() || "Untitled",
      description: descMatch?.[1]?.trim() || "",
      category: categoryMatch?.[1]?.trim() || "uncategorized",
      order: parseInt(orderMatch?.[1] || "0"),
      tags: tagsMatch
        ? tagsMatch[1].split(",").map((t: string) => t.trim())
        : [],
      status: (statusMatch?.[1] as "draft" | "published") || "draft",
    },
    content: body.trim(),
    lastModified: stats.mtime,
  };
}

/**
 * Create a new document
 */
export async function createDocAction(data: DocFormData) {
  try {
    const validated = docSchema.parse(data);

    // Generate slug from title
    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // If in production with Supabase, use database
    if (useSupabase) {
      const result = await createDocInSupabase({
        slug,
        title: validated.title,
        description: validated.description,
        category: validated.category,
        content: validated.content,
        tags: validated.tags,
        order: validated.order,
        status: validated.status,
      });

      if (!result.success) {
        return { error: result.error || "Failed to create document in database" };
      }

      revalidatePath("/docs");
      revalidatePath("/admin");
      return { success: true, slug };
    }

    // Local development: use filesystem
    const categoryDir = path.join(docsDir, validated.category);
    await fs.mkdir(categoryDir, { recursive: true });

    const filePath = path.join(categoryDir, `${slug}.mdx`);

    // Format frontmatter
    const frontmatter = `---
title: "${validated.title}"
description: "${validated.description}"
category: "${validated.category}"
order: ${validated.order}
status: "${validated.status}"
tags: [${validated.tags.map((t) => `"${t}"`).join(", ")}]
---

`;

    // Write file
    await fs.writeFile(filePath, frontmatter + validated.content);

    // Revalidate the docs route
    revalidatePath("/docs");
    revalidatePath("/admin");

    return { success: true, slug };
  } catch (error) {
    console.error("Error creating document:", error);
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map(e => `${e.path}: ${e.message}`).join(", ");
      return { error: "Validation failed", details: errorDetails };
    }
    if (error instanceof Error) {
      return { error: "Failed to create document", details: error.message };
    }
    return { error: "Failed to create document" };
  }
}

/**
 * Update an existing document
 */
export async function updateDocAction(slug: string, data: DocFormData) {
  try {
    const validated = docSchema.parse(data);

    // If in production with Supabase, use database
    if (useSupabase) {
      const result = await updateDocInSupabase(slug, {
        title: validated.title,
        description: validated.description,
        category: validated.category,
        content: validated.content,
        tags: validated.tags,
        order: validated.order,
        status: validated.status,
      });

      if (!result.success) {
        return { error: result.error || "Failed to update document in database" };
      }

      revalidatePath("/docs");
      revalidatePath("/admin");
      return { success: true };
    }

    // Local development: use filesystem
    const doc = await getDocBySlugAction(slug);
    if (!doc) {
      return { error: "Document not found" };
    }

    const filePath = path.join(process.cwd(), doc.filePath);

    // Format frontmatter
    const frontmatter = `---
title: "${validated.title}"
description: "${validated.description}"
category: "${validated.category}"
order: ${validated.order}
status: "${validated.status}"
tags: [${validated.tags.map((t) => `"${t}"`).join(", ")}]
---

`;

    // Write file
    await fs.writeFile(filePath, frontmatter + validated.content);

    // Revalidate the docs route
    revalidatePath("/docs");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error updating document:", error);
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map(e => `${e.path}: ${e.message}`).join(", ");
      return { error: "Validation failed", details: errorDetails };
    }
    if (error instanceof Error) {
      return { error: "Failed to update document", details: error.message };
    }
    return { error: "Failed to update document" };
  }
}

/**
 * Delete a document
 */
export async function deleteDocAction(slug: string) {
  try {
    // If in production with Supabase, use database
    if (useSupabase) {
      const result = await deleteDocInSupabase(slug);

      if (!result.success) {
        return { error: result.error || "Failed to delete document from database" };
      }

      revalidatePath("/docs");
      revalidatePath("/admin");
      return { success: true };
    }

    // Local development: use filesystem
    const doc = await getDocBySlugAction(slug);
    if (!doc) {
      return { error: "Document not found" };
    }

    const filePath = path.join(process.cwd(), doc.filePath);
    await fs.unlink(filePath);

    // Revalidate the docs route
    revalidatePath("/docs");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    if (error instanceof Error) {
      return { error: "Failed to delete document", details: error.message };
    }
    return { error: "Failed to delete document" };
  }
}

/**
 * Search documents with filters
 */
export interface SearchOptions {
  query?: string;
  category?: string;
  tags?: string[];
  sortBy?: "relevance" | "date" | "order" | "title";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

export async function searchDocsAction(options: SearchOptions = {}) {
  try {
    const {
      query,
      category,
      tags,
      sortBy = "relevance",
      sortOrder = "desc",
      limit = 50,
    } = options;

    // Get all documents
    const allDocs = await getAllDocsAction();
    
    if (!allDocs || allDocs.length === 0) {
      return [];
    }

    let results = allDocs.map((doc) => {
      let relevanceScore = 0;

      // If there's a search query, calculate relevance
      if (query) {
        const queryLower = query.toLowerCase();
        const titleLower = doc.title.toLowerCase();
        const descLower = doc.description.toLowerCase();
        const tagsLower = doc.tags.map((t) => t.toLowerCase());

        // Title match (highest weight)
        if (titleLower.includes(queryLower)) {
          relevanceScore += 100;
          // Exact title match gets bonus
          if (titleLower === queryLower) {
            relevanceScore += 50;
          }
        }

        // Description match (medium weight)
        if (descLower.includes(queryLower)) {
          relevanceScore += 50;
        }

        // Tag match (lower weight)
        if (tagsLower.some((tag) => tag.includes(queryLower))) {
          relevanceScore += 30;
        }

        // Category match
        if (doc.category.toLowerCase().includes(queryLower)) {
          relevanceScore += 20;
        }
      } else {
        // No query, give all docs same base score
        relevanceScore = 1;
      }

      return {
        ...doc,
        relevanceScore,
      };
    });

    // Apply filters
    if (category) {
      results = results.filter(
        (doc) => doc.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (tags && tags.length > 0) {
      results = results.filter((doc) =>
        tags.some((tag) =>
          doc.tags.some((docTag) =>
            docTag.toLowerCase() === tag.toLowerCase()
          )
        )
      );
    }

    // Filter out docs with 0 relevance if there's a query
    if (query) {
      results = results.filter((doc) => doc.relevanceScore > 0);
    }

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "relevance":
          comparison = (b.relevanceScore || 0) - (a.relevanceScore || 0);
          break;
        case "date":
          comparison =
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime();
          break;
        case "order":
          comparison = (a.order || 0) - (b.order || 0);
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === "asc" ? -comparison : comparison;
    });

    // Apply limit
    results = results.slice(0, limit);

    return results;
  } catch (error) {
    console.error("Error searching documents:", error);
    return [];
  }
}

/**
 * Bulk upload documents from JSON
 */
export interface BulkUploadDoc {
  title: string;
  description: string;
  category: string;
  order?: number;
  tags?: string[];
  content: string;
}

export interface BulkUploadResult {
  success: boolean;
  created?: number;
  failed?: Array<{
    index: number;
    title: string;
    error: string;
  }>;
  message?: string;
}

export async function bulkUploadAction(docs: BulkUploadDoc[]): Promise<BulkUploadResult> {
  try {
    if (!Array.isArray(docs) || docs.length === 0) {
      return { success: false, message: "Hujjatlar ro'yxati bo'sh" };
    }

    const results = {
      created: 0,
      failed: [] as Array<{
        index: number;
        title: string;
        error: string;
      }>,
    };

    for (let i = 0; i < docs.length; i++) {
      const docData = docs[i];
      
      try {
        // Validate each document
        const validated = docSchema.parse({
          ...docData,
          order: docData.order ?? 0,
          tags: docData.tags ?? [],
        });

        // Create category directory if it doesn't exist
        const categoryDir = path.join(docsDir, validated.category);
        await fs.mkdir(categoryDir, { recursive: true });

        // Generate slug from title
        const slug = validated.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const filePath = path.join(categoryDir, `${slug}.mdx`);

        // Check if file already exists
        try {
          await fs.access(filePath);
          results.failed.push({
            index: i,
            title: validated.title,
            error: "Fayl allaqachon mavjud",
          });
          continue;
        } catch {
          // File doesn't exist, continue
        }

        // Format frontmatter
        const frontmatter = `---
title: "${validated.title}"
description: "${validated.description}"
category: "${validated.category}"
order: ${validated.order}
tags: [${validated.tags.map((t) => `"${t}"`).join(", ")}]
---

`;

        // Write file
        await fs.writeFile(filePath, frontmatter + validated.content);
        results.created++;
      } catch (error) {
        let errorMessage = "Noma'lum xatolik";
        
        if (error instanceof z.ZodError) {
          errorMessage = error.errors.map(e => e.message).join(", ");
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        results.failed.push({
          index: i,
          title: docData.title || "Noma'lum",
          error: errorMessage,
        });
      }
    }

    // Revalidate the docs route
    revalidatePath("/docs");
    revalidatePath("/admin");

    return {
      success: results.created > 0,
      created: results.created,
      failed: results.failed,
      message: `${results.created} ta hujjat yaratildi, ${results.failed.length} ta xato`,
    };
  } catch (error) {
    console.error("Error in bulk upload:", error);
    return {
      success: false,
      message: "Bulk upload jarayonida xatolik yuz berdi",
    };
  }
}

/**
 * Get all categories from categories.json
 */
export async function getAllCategoriesAction() {
  try {
    try {
      const content = await fs.readFile(categoriesJsonPath, "utf-8");
      const categories = JSON.parse(content);
      return categories.sort((a: any, b: any) => a.order - b.order);
    } catch {
      // If file doesn't exist, return empty array
      return [];
    }
  } catch (error) {
    console.error("Error reading categories:", error);
    return [];
  }
}

/**
 * Create a new category
 */
export async function createCategoryAction(data: CategoryFormData) {
  try {
    const validated = categorySchema.parse(data);

    // Ensure config directory exists
    const configDir = path.join(docsDir, "config");
    await fs.mkdir(configDir, { recursive: true });

    // Get existing categories
    let categories = [];
    try {
      const content = await fs.readFile(categoriesJsonPath, "utf-8");
      categories = JSON.parse(content);
    } catch {
      // File doesn't exist yet
      categories = [];
    }

    // Check if category already exists
    if (categories.some((cat: any) => cat.id === validated.id)) {
      return { error: "Kategoriya allaqachon mavjud" };
    }

    // Add new category
    const newCategory = {
      ...validated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    categories.push(newCategory);
    categories.sort((a: any, b: any) => a.order - b.order);

    // Write updated categories
    await fs.writeFile(categoriesJsonPath, JSON.stringify(categories, null, 2));

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof z.ZodError) {
      return { error: "Validatsiya xatosi", details: error.errors };
    }
    return { error: "Kategoriya yaratishda xatolik" };
  }
}

/**
 * Update an existing category
 */
export async function updateCategoryAction(id: string, data: Partial<CategoryFormData>) {
  try {
    const configDir = path.join(docsDir, "config");
    await fs.mkdir(configDir, { recursive: true });

    // Get existing categories
    let categories = [];
    try {
      const content = await fs.readFile(categoriesJsonPath, "utf-8");
      categories = JSON.parse(content);
    } catch {
      return { error: "Kategoriyalar topilmadi" };
    }

    // Find and update category
    const categoryIndex = categories.findIndex((cat: any) => cat.id === id);
    if (categoryIndex === -1) {
      return { error: "Kategoriya topilmadi" };
    }

    // Validate updated fields
    const validated = categorySchema.partial().parse(data);

    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...validated,
      updatedAt: new Date().toISOString(),
    };

    categories.sort((a: any, b: any) => a.order - b.order);

    // Write updated categories
    await fs.writeFile(categoriesJsonPath, JSON.stringify(categories, null, 2));

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof z.ZodError) {
      return { error: "Validatsiya xatosi", details: error.errors };
    }
    return { error: "Kategoriyani yangilashda xatolik" };
  }
}

/**
 * Delete a category
 */
export async function deleteCategoryAction(id: string) {
  try {
    // Get all docs to check if any use this category
    const docs = await getAllDocsAction();
    const docsUsingCategory = docs.filter((doc: any) => doc.category === id);

    if (docsUsingCategory.length > 0) {
      return {
        error: `Bu kategoriyada ${docsUsingCategory.length} ta hujjat mavjud. Avval hujjatlarni o'chiring yoki boshqa kategoriyaga o'tkazib yuboring.`,
        docsCount: docsUsingCategory.length
      };
    }

    // Get existing categories
    let categories = [];
    try {
      const content = await fs.readFile(categoriesJsonPath, "utf-8");
      categories = JSON.parse(content);
    } catch {
      return { error: "Kategoriyalar topilmadi" };
    }

    // Find and remove category
    const categoryIndex = categories.findIndex((cat: any) => cat.id === id);
    if (categoryIndex === -1) {
      return { error: "Kategoriya topilmadi" };
    }

    categories.splice(categoryIndex, 1);

    // Write updated categories
    await fs.writeFile(categoriesJsonPath, JSON.stringify(categories, null, 2));

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Kategoriyani o'chirishda xatolik" };
  }
}

/**
 * Reorder categories
 */
export async function reorderCategoriesAction(categoryIds: string[]) {
  try {
    // Get existing categories
    let categories = [];
    try {
      const content = await fs.readFile(categoriesJsonPath, "utf-8");
      categories = JSON.parse(content);
    } catch {
      return { error: "Kategoriyalar topilmadi" };
    }

    // Update order based on new order
    const updatedCategories = categoryIds.map((id, index) => {
      const category = categories.find((cat: any) => cat.id === id);
      if (!category) return null;
      return {
        ...category,
        order: index,
        updatedAt: new Date().toISOString(),
      };
    }).filter(Boolean);

    if (updatedCategories.length !== categories.length) {
      return { error: "Ba'zi kategoriyalar topilmadi" };
    }

    // Write updated categories
    await fs.writeFile(categoriesJsonPath, JSON.stringify(updatedCategories, null, 2));

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error reordering categories:", error);
    return { error: "Kategoriyalarni qayta tartiblashtishda xatolik" };
  }
}
