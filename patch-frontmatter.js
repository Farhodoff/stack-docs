const fs = require('fs');

function updateFrontmatter(filePath, newFields) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content.replace(/^---[\s\S]*?---/, (match) => {
    let lines = match.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('category:')) {
        lines[i] = `category: "${newFields.category}"`;
      }
      if (lines[i].startsWith('order:')) {
        lines[i] = `order: ${newFields.order}`;
      }
      if (newFields.title && lines[i].startsWith('title:')) {
        lines[i] = `title: "${newFields.title}"`;
      }
    }
    return lines.join('\n');
  });
  fs.writeFileSync(filePath, newContent);
}

// Map files to new frontmatter
updateFrontmatter('docs/introduction/what-is-fullstack.mdx', { category: '1. Introduction', order: 1 });
updateFrontmatter('docs/frontend/fundamentals.mdx', { category: '2. Frontend Fundamentals', order: 2 });
updateFrontmatter('docs/backend/basics.mdx', { category: '3. Backend Basics', order: 3 });
updateFrontmatter('docs/api/building-apis.mdx', { category: '4. Building APIs', order: 4 });
updateFrontmatter('docs/database/prisma-postgresql.mdx', { category: '5. Databases', order: 5 });
updateFrontmatter('docs/authentication/nextauth-jwt.mdx', { category: '6. Authentication', order: 6 });
updateFrontmatter('docs/best-practices/project-structure.mdx', { category: '7. Best Practices', order: 7 });
updateFrontmatter('docs/fullstack/modern-stack.mdx', { category: '8. Modern Fullstack', order: 8 });
updateFrontmatter('docs/deployment/vercel-railway.mdx', { category: '9. Deployment Guide', order: 9 });

