-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT,
  category VARCHAR,
  status VARCHAR DEFAULT 'draft',
  tags TEXT[],
  order_num INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR,
  updated_by VARCHAR
);

-- Create index for search
CREATE INDEX idx_documents_slug ON documents(slug);
CREATE INDEX idx_documents_title ON documents USING GIN(to_tsvector('english', title));
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_status ON documents(status);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Public read policy (published docs only)
CREATE POLICY "Public read published docs"
  ON documents FOR SELECT
  USING (status = 'published');

-- Admin full access (via JWT with role)
CREATE POLICY "Admin full access"
  ON documents FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
