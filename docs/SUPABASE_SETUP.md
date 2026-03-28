# Production Setup - Supabase Integration

## Overview

The admin panel now supports both **local development** (filesystem) and **production** (Supabase database) environments.

- **Local (npm run dev):** Darslar file systemda saqlanadi
- **Production (Vercel):** Darslar Supabase'da saqlanadi

## Environment Setup

### 1. Supabase Project Yaratish

```bash
1. https://supabase.com ga o'ting
2. New project qo'shish
3. Database credentials' olish
```

### 2. Environment Variables (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anonymous-key
```

### 3. Documents Table Yaratish

Supabase SQL Editor'da quyidagilarni ko'chiring:

```sql
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

CREATE INDEX idx_documents_slug ON documents(slug);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_order ON documents("order");

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Public read for published docs
CREATE POLICY "Public read access for published" ON documents
  FOR SELECT
  USING (status = 'published');

-- Authenticated admin access
CREATE POLICY "Authenticated admin access" ON documents
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### 4. Authentication Setup (Optional)

Agar admin panel'ni protected qilmoqchi bo'lsangiz:

```bash
1. Supabase Auth'ni enable qilish
2. User'larni qo'shish
3. Admin panel'ni protect qilish
```

## Usage

### Local Development

```bash
npm run dev
# Admin panel: http://localhost:3000/admin/create
# Darslar: /docs MDX files'da saqlanadi
```

### Production (Vercel)

```bash
# Environment variables:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Admin panel: https://your-site.vercel.app/admin/create
# Darslar: Supabase database'da saqlanadi
```

## How It Works

### Local Environment (npm run dev)

1. Admin panel'dan dars qo'shasiz
2. File `/docs/[category]/[slug].mdx` da saqlanadi
3. Git'ga push qilasiz
4. Production deploy'lanadi

### Production Environment (Vercel)

1. Admin panel'dan dars qo'shasiz
2. Supabase database'ga saqlanadi
3. Dars darhol Deploy qilmg'ni kutmasdan ko'rinadi
4. GitHub'ga commit bo'lmaydi (database'da)

## Supabase RLS (Row Level Security)

- **Public users:** Faqat `published` darslarni ko'radi
- **Authenticated:** Admin darslarni qo'shishi, tahrirlashi, o'chirishi mumkin

## Migration from Files to Database

Agar mavjud `/docs` file'larni Supabase'ga o'tkazmoqchi bo'lsangiz:

```bash
# Script yaratish kerak bo'ladi
# mdx file'larni o'qib → Supabase'ga yozish
```

## Troubleshooting

### "Supabase not configured"

```
.env.local'da credentials bor-yo'qligini tekshirish
NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY mavjud bo'lishi kerak
```

### "EROFS: read-only file system"

```
Bu Vercel production'da normal - Supabase ishlatilmoqda
Local'da npm run dev bo'lsa to'g'ri ishlaydi
```

## Results

✅ Local admin panel ishlaydi (file system)
✅ Production admin panel ishlaydi (Supabase)
✅ Darslar real-time uchun ko'rinadi
✅ Deployment qo'shimcha kutilmaydi
