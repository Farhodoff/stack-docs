# Vercel Environment Variables Setup

## Problem
Login showing "Invalid credentials" on Vercel because env variables not set.

## Solution

1. Go to: https://vercel.com/dashboard
2. Select project: **stack**
3. Click: **Settings** (top menu)
4. Left sidebar: **Environment Variables**
5. Add these variables:

```
ADMIN_EMAIL = fsoyilov@gmail.com
ADMIN_PASSWORD = fara.totsamiy1
NEXT_PUBLIC_SUPABASE_URL = https://nubkzdubcqczoutrykwy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Ymt6ZHViY3Fjem91dHJ5a3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MTQwMjcsImV4cCI6MjA5MDA5MDAyN30.iMO0iw_I9gyihuhCDpVgxVbz01ZXmEcfsx_KSjZphyg
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Ymt6ZHViY3Fjem91dHJ5a3d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUxNDAyNywiZXhwIjoyMDkwMDkwMDI3fQ.gCi90xATnKJ6AYi3cJHFiNmNnX1OhGWb4vno_BEnIQY
```

6. Click **Save**
7. Vercel auto-redeploys (check Deployments tab)
8. Try login again!

## Steps:
- [ ] Go to Vercel Settings
- [ ] Add all 5 environment variables
- [ ] Wait for redeploy
- [ ] Refresh `/login`
- [ ] Try again: fsoyilov@gmail.com / fara.totsamiy1

✅ Login should work!
