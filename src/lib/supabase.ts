import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials not configured");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

export interface DocRecord {
  id?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
  order: number;
  status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
}

// Check if Supabase is available
export const isSupabaseAvailable = () => {
  return !!(supabaseUrl && supabaseKey);
};

// Create a document in Supabase
export async function createDocInSupabase(doc: DocRecord) {
  if (!isSupabaseAvailable()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("documents")
      .insert([{ ...doc, created_at: new Date().toISOString() }]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// Update a document in Supabase
export async function updateDocInSupabase(slug: string, doc: Partial<DocRecord>) {
  if (!isSupabaseAvailable()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("documents")
      .update({ ...doc, updated_at: new Date().toISOString() })
      .eq("slug", slug);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// Delete a document from Supabase
export async function deleteDocInSupabase(slug: string) {
  if (!isSupabaseAvailable()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("slug", slug);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// Get all documents from Supabase
export async function getAllDocsFromSupabase() {
  if (!isSupabaseAvailable()) {
    return { success: false, error: "Supabase not configured", data: [] };
  }

  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("status", "published")
      .order("order", { ascending: true });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: String(err), data: [] };
  }
}

// Get a document by slug from Supabase
export async function getDocBySlugFromSupabase(slug: string) {
  if (!isSupabaseAvailable()) {
    return { success: false, error: "Supabase not configured", data: null };
  }

  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err), data: null };
  }
}
