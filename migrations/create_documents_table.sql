-- PostgreSQL Migration Script - Create documents table for Supabase
-- This file uses PostgreSQL-specific syntax (UUID, gen_random_uuid, arrays)
-- Compatible with PostgreSQL 12+ and Supabase
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  "order" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster queries
CREATE INDEX idx_documents_slug ON documents(slug);

-- Create index on category for filtering
CREATE INDEX idx_documents_category ON documents(category);

-- Create index on status for filtering published docs
CREATE INDEX idx_documents_status ON documents(status);

-- Create index on order for sorting
CREATE INDEX idx_documents_order ON documents("order");

-- Enable RLS (Row Level Security)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for published documents
CREATE POLICY "Public read access for published" ON documents
  FOR SELECT
  USING (status = 'published');

-- Create policy to allow authenticated users to do everything (for admin panel)
CREATE POLICY "Authenticated admin access" ON documents
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
