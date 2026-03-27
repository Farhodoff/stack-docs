# Quick Start Guide

Get your Fullstack Documentation site up and running in under 5 minutes!

## Installation (2 minutes)

### Step 1: Install Dependencies

```bash
cd /path/to/project
npm install
```

This will install all required packages including:
- Next.js 15 & React 18
- TypeScript
- Tailwind CSS
- MDX support
- UI components
- Search functionality
- And more!

## Development (1 minute)

### Step 2: Run Development Server

```bash
npm run dev
```

Your site will be available at: **http://localhost:3000**

That's it! The development server includes:
- ✅ Hot module replacement
- ✅ Fast refresh
- ✅ Automatic routing
- ✅ All documentation loaded from `/docs` folder

## Adding Your First Documentation (2 minutes)

### Step 3: Create a New MDX File

Create a new file: `docs/my-category/my-first-doc.mdx`

```mdx
---
title: "My First Documentation"
description: "Learn how to create amazing docs"
category: "my-category"
order: 1
tags:
  - getting-started
  - tutorial
---

# My First Documentation

Welcome to your first documentation page!

## Section 1

Start writing your content here...

<CodeBlock language="tsx" title="Example">
{`console.log('Hello, World!')`}
</CodeBlock>

<Tip>
This is a helpful tip callout!
</Tip>
```

### Step 4: View Your Changes

The page automatically appears in:
- Sidebar navigation
- Search results
- Category listings
- Previous/Next pagination

No code changes needed!

## Deployment (Optional)

### Deploy to Vercel

1. Push to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (if needed)
5. Click "Deploy"

**Environment Variables** (optional):
```env
DATABASE_URL=your-database-url
NEXTAUTH_SECRET=your-secret-key
```

## Project Structure Overview

```
project/
├── docs/                    # 📚 YOUR DOCUMENTATION HERE
│   ├── introduction/
│   ├── frontend/
│   ├── backend/
│   └── ...
│
├── src/
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   └── lib/               # Utilities
│
├── package.json
├── README.md              # Full documentation
└── tailwind.config.ts
```

## Available Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Check code quality
```

## Customization

### Change Site Title & Description

Edit `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Your Site Name',
  description: 'Your site description',
  // ...
}
```

### Customize Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Your brand color */
  /* ... other colors */
}
```

### Add Custom Components

Create components in `src/components/docs/` and use them in MDX:

```mdx
<MyCustomComponent prop="value">
  Content here
</MyCustomComponent>
```

## Getting Help

- 📖 Read the full [README.md](./README.md)
- 🔍 Check existing documentation in `/docs`
- 💬 Open an issue on GitHub
- 🎨 View component examples in `src/components`

## Next Steps

Now that you're set up:

1. ✅ Explore the sample documentation in `/docs`
2. ✅ Try creating your own documentation page
3. ✅ Customize the theme and branding
4. ✅ Add custom components
5. ✅ Deploy to production

Happy documenting! 🚀

---

**Pro Tip:** Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) anywhere on the site to open search and quickly navigate through documentation!
