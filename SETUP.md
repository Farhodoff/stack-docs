# Stack Docs - Setup Guide

## Environment Variables

Create `.env.local` file in project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Admin Credentials
ADMIN_EMAIL=fsoyilov@gmail.com
ADMIN_PASSWORD=fara.totsamiy1
```

## 1. Admin Panel Features ✅

| Feature | Status | Path |
|---------|--------|------|
| Create Document | ✅ Implemented | `/admin/create` |
| Edit Document | ✅ Implemented | `/admin/edit/[slug]` |
| Delete Document | ✅ Implemented | `/admin/documents` |
| Bulk Upload | ✅ Implemented | `/admin/bulk-upload` |
| Dashboard | ✅ Implemented | `/admin` |

**Usage:**
1. Login at `/login`
2. Go to Dashboard `/admin`
3. Click "Create" to add new documentation
4. Click "Documents" to view/edit/delete

## 2. Search Functionality ✅

| Feature | Status | Path |
|---------|--------|------|
| Full-text Search | ✅ Implemented | `/search` |
| Admin Search | ✅ Implemented | `/admin/search` |

**Usage:**
- Public search: `/search` (visible docs)
- Admin search: `/admin/search` (all docs including drafts)

## 3. Supabase Integration

**Required Setup:**

1. Create Supabase account: https://supabase.com
2. Create new project
3. Get credentials from Settings > API
4. Create tables:

```sql
-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT,
  category VARCHAR,
  status VARCHAR DEFAULT 'draft',
  tags TEXT[],
  "order" INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for search
CREATE INDEX idx_documents_title ON documents USING GIN(title);
```

5. Set environment variables

## Getting Started

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Open browser
# Home: http://localhost:3000
# Admin: http://localhost:3000/admin
# Login: http://localhost:3000/login
```

## Deployment

### Vercel + Supabase

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
4. Deploy!

**Live:** https://stack-docs.vercel.app
