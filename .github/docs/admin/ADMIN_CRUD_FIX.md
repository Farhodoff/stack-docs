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
