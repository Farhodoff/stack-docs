# Supabase Setup Guide

## 1. Credentials Added ✅

Your `.env.local` now has:
```
NEXT_PUBLIC_SUPABASE_URL=https://nubkzdubcqczoutrykwy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 2. Create Database Tables

### Option A: Using Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Open **SQL Editor**
4. Create new query
5. Copy & paste content from `supabase/migrations/create_documents_table.sql`
6. Click **Run**

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref nubkzdubcqczoutrykwy

# Run migration
supabase push
```

## 3. SQL Schema Created

The migration creates:

**Table: `documents`**
- `id` - UUID primary key
- `slug` - Unique document identifier
- `title` - Document title
- `description` - Short description
- `content` - MDX content
- `category` - Document category
- `status` - 'draft' or 'published'
- `tags` - Array of tags
- `order_num` - Display order
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Indexes:**
- `slug` - Fast lookups by slug
- `title` - Full-text search
- `category` - Filter by category
- `status` - Filter by status

**Row Level Security (RLS):**
- Public can only read published docs
- Admin can do everything (authenticated)

**Triggers:**
- Auto-update `updated_at` on changes

## 4. Verification

Test connection:

```bash
npm run dev
# Visit: http://localhost:3000
# Admin panel should load without errors
```

## 5. Next Steps

After setup:
- [ ] Go to `/admin` → Login
- [ ] Try creating a new document
- [ ] Document should sync to Supabase
- [ ] Go to `/search` to test search functionality

## Environment Variables Reference

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://nubkzdubcqczoutrykwy.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | JWT token (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | JWT token (private/server-only) |
| `ADMIN_EMAIL` | fsoyilov@gmail.com |
| `ADMIN_PASSWORD` | fara.totsamiy1 |

⚠️ **Security Note:** 
- `.env.local` is in `.gitignore` (not committed)
- Service role key should only be used server-side
- Add these variables to Vercel dashboard for production

## Troubleshooting

**Error: "relation 'documents' does not exist"**
→ Run migration SQL in Supabase dashboard

**Error: "permission denied for schema public"**
→ Check RLS policies are created

**Error: "JWT invalid"**
→ Verify ANON_KEY in .env.local

**Connection timeout**
→ Check SUPABASE_URL is correct

## Support

For issues:
1. Check Supabase dashboard: https://supabase.com/dashboard
2. View logs in Table Editor
3. Check RLS policies in Authentication > Policies
