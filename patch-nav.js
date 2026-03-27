const fs = require('fs');
let code = fs.readFileSync('src/lib/readDocsMetadata.ts', 'utf-8');

code = code.replace(`export function getNavigationItems() {
  const categories = getCategories();

  return Object.entries(categories).map(([categoryName, docs]) => ({
    category: categoryName,
    items: docs.map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
    })),
  }));
}`, `export function getNavigationItems() {
  const categories = getCategories();

  const sortedCategories = Object.entries(categories)
    .map(([categoryName, docs]) => {
      // Find minimum order in this category to sort categories
      const minOrder = Math.min(...docs.map(d => d.order || 999));
      return {
        category: categoryName,
        minOrder,
        items: docs.map((doc) => ({
          slug: doc.slug,
          title: doc.title,
          description: doc.description,
          order: doc.order,
        })),
      };
    })
    .sort((a, b) => a.minOrder - b.minOrder);

  return sortedCategories.map(cat => ({
    category: cat.category,
    items: cat.items.sort((a, b) => (a.order || 0) - (b.order || 0)).map(item => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
    }))
  }));
}`);

fs.writeFileSync('src/lib/readDocsMetadata.ts', code);
