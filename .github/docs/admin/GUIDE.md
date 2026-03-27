# Admin Dashboard Quick Reference

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy example env file
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
```

### 2. Create Supabase User
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Email: `admin@example.com`, Password: `ChangeMe123!`

### 3. Run Development Server
```bash
npm install
npm run dev
```

Visit: http://localhost:3000/login

---

## 📁 File Structure Overview

```
src/
├── app/
│   ├── admin/              # Admin Dashboard (Protected)
│   │   ├── layout.tsx      # Admin layout with sidebar
│   │   ├── page.tsx        # Dashboard home
│   │   ├── actions.ts      # Server Actions (CRUD)
│   │   ├── create/         # Create document
│   │   ├── edit/[slug]/    # Edit document
│   │   ├── documents/      # All documents view
│   │   └── settings/       # Settings page
│   │
│   └── login/              # Login page
│
├── components/
│   ├── admin/              # Admin UI components
│   │   ├── admin-sidebar.tsx
│   │   ├── doc-form.tsx
│   │   ├── doc-list.tsx
│   │   └── delete-dialog.tsx
│   │
│   └── auth/               # Authentication components
│       ├── login-form.tsx
│       ├── oauth-buttons.tsx
│       └── user-nav.tsx
│
├── lib/
│   ├── supabase/           # Supabase utilities
│   │   ├── server.ts       # Server client
│   │   ├── client.ts       # Browser client
│   │   ├── middleware.ts   # Session middleware
│   │   └── auth.ts         # Auth Server Actions
│   │
│   └── client.ts           # Browser client export
│
└── middleware.ts           # Route protection

types/
└── supabase.ts            # TypeScript types
```

---

## 🔑 Key Files Explained

### Authentication Flow

**`src/middleware.ts`**
- Runs on every request
- Validates Supabase session
- Redirects unauthenticated users from `/admin/*` to `/login`

**`src/lib/supabase/auth.ts`**
- `login(email, password)` - Sign in user
- `logout()` - Sign out and redirect
- `getSession()` - Get current session (Server Component)
- `getUser()` - Get current user (Server Component)

**`src/lib/supabase/server.ts`**
- Creates Supabase client for Server Components
- Handles cookie management automatically

**`src/lib/client.ts`**
- Creates Supabase client for Client Components
- Use in interactive components only

---

### Admin Operations

**`src/app/admin/actions.ts`**
- `getAllDocsAction()` - Get all documents metadata
- `getDocBySlugAction(slug)` - Get single document
- `createDocAction(data)` - Create new document
- `updateDocAction(slug, data)` - Update existing
- `deleteDocAction(slug)` - Delete document

All actions:
- ✅ Server-side only
- ✅ Zod validation
- ✅ Automatic revalidation
- ✅ Error handling

---

## 🎨 Admin Pages

### 1. Dashboard (`/admin`)
- KPI cards (total docs, categories, last updated)
- Recent documents table
- Quick "Create New" button

### 2. All Documents (`/admin/documents`)
- Searchable table
- Filter by category
- Sort by any column
- Actions: Edit, Delete, Preview

### 3. Create Document (`/admin/create`)
- Form with validation:
  - Title (required)
  - Description (required)
  - Category (required, creates folder)
  - Order (number, controls sequence)
  - Tags (comma-separated)
- MDX editor with preview
- Saves to `/docs/{category}/{slug}.mdx`

### 4. Edit Document (`/admin/edit/[slug]`)
- Loads existing content
- Same form as create
- Updates file in place
- Preserves frontmatter format

### 5. Settings (`/admin/settings`)
- Platform information
- Storage details
- Feature list
- Security overview

---

## 🔒 Security Checklist

### Development
- [ ] Set strong admin password
- [ ] Don't commit `.env.local`
- [ ] Use localhost only

### Production
- [ ] Enable email confirmation
- [ ] Use environment variables (Vercel/Railway)
- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Monitor error logs
- [ ] Regular security audits

---

## 📝 Common Tasks

### Adding a New Document

**Via Admin Panel:**
1. Navigate to `/admin/create`
2. Fill in form fields
3. Write MDX content
4. Click "Create Document"

**Manual (File System):**
1. Create `docs/category/name.mdx`
2. Add frontmatter:
   ```mdx
   ---
   title: "My Document"
   description: "Description here"
   category: "category"
   order: 1
   tags: [tag1, tag2]
   ---
   ```
3. Write content below frontmatter

---

### Editing Existing Document

**Via Admin Panel:**
1. Go to `/admin/documents`
2. Find document
3. Click Edit icon
4. Make changes
5. Save

**Manual:**
1. Open `.mdx` file in `docs/`
2. Edit frontmatter or content
3. Save file

---

### Deleting a Document

**Via Admin Panel:**
1. Navigate to document
2. Click Delete icon
3. Confirm deletion

**Manual:**
1. Delete `.mdx` file from `docs/`
2. Git commit the deletion

---

## 🐛 Debugging Tips

### Check Authentication
```typescript
// In browser console after login
document.cookie
// Should see Supabase session cookies
```

### Verify Environment Variables
```bash
# Check if vars are loaded
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Test Server Actions
```typescript
// In Node.js REPL or terminal
curl http://localhost:3000/api/test-auth
```

### View Logs
```bash
# Development
npm run dev
# Watch terminal for errors

# Production (Vercel)
vercel logs
```

---

## ⚡ Performance Tips

### Optimization Strategies

1. **Server Components**: Use RSC where possible
   - Data fetching in Server Components
   - Client Components only for interactivity

2. **Caching**: Leverage Next.js cache
   - `revalidatePath()` after mutations
   - Static generation where possible

3. **Bundle Size**: Keep client bundle small
   - Import only needed shadcn/ui components
   - Lazy load heavy components

4. **Images**: Optimize images
   - Use Next.js Image component
   - Compress assets

---

## 🎯 Best Practices

### Writing Good Documentation

✅ **DO:**
- Use clear, descriptive titles
- Write concise descriptions
- Organize by category
- Set logical order values
- Add relevant tags
- Include code examples
- Use callouts for emphasis

❌ **DON'T:**
- Use vague titles
- Skip descriptions
- Create too many categories
- Forget to test examples
- Use jargon without explanation

---

### Code Organization

**Frontmatter Standards:**
```yaml
---
title: "Clear, Descriptive Title"
description: "One sentence summary (max 160 chars)"
category: "lowercase-with-dashes"
order: 1  # 0 = first, higher = later
tags: [react, nextjs, tutorial]
---
```

**MDX Content:**
- Use headings hierarchically (H2 → H3 → H4)
- Include code examples
- Add `<Note>`, `<Tip>`, `<Warning>` callouts
- Link related documentation
- Keep paragraphs short (3-4 sentences)

---

## 🆘 Troubleshooting

### Login Not Working
1. Check Supabase credentials in `.env.local`
2. Verify user exists in Supabase dashboard
3. Ensure email is confirmed (if enabled)
4. Clear browser cookies
5. Try incognito mode

### Changes Not Appearing
1. Hard refresh: Cmd+Shift+R / Ctrl+Shift+F5
2. Check if file was saved to disk
3. Verify correct category/slug
4. Restart dev server
5. Clear `.next` cache

### Can't Access Admin
1. Ensure you're logged in
2. Check middleware isn't blocking
3. Verify session in browser DevTools
4. Try logging out and back in

### Editor Not Saving
1. Check all required fields filled
2. Verify category name is valid
3. Ensure no special characters in slug
4. Check write permissions on `/docs`
5. Review server logs for errors

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **MDX Docs**: https://mdxjs.com/docs

---

**Happy documenting! 🚀**
# Admin CRUD Delete Issue Fix

## Problem:
"Document not found" when deleting

## Root Cause:
Slug format mismatch between create and delete

## Solution:

1. Ensure slug includes category:
   - Save: `docs/category/slug.mdx`
   - Delete slug: `category/slug` ✅

2. Check function:
```bash
# Test delete
curl -X POST http://localhost:3000/api/admin/delete \
  -H "Content-Type: application/json" \
  -d '{"slug": "category/document-name"}'
```

3. If still failing:
   - Check `/admin/documents` list
   - Copy exact slug
   - Try delete with console open (F12)

## Quick Workaround:
- Delete directly: `rm docs/category/slug.mdx`
- Then refresh admin panel

## Long-term:
Switch to Supabase (handles all this automatically)
