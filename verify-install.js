#!/usr/bin/env node

/**
 * Installation Verification Script
 * 
 * This script checks if all required files and dependencies are in place.
 * Run it with: node verify-install.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Fullstack Documentation Platform Installation...\n');

let hasErrors = false;

// Check package.json
console.log('✓ Checking package.json...');
if (!fs.existsSync('package.json')) {
  console.error('✗ package.json not found!');
  hasErrors = true;
} else {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  console.log(`  Package: ${pkg.name}`);
  console.log(`  Version: ${pkg.version}`);
}

// Check configuration files
const configFiles = [
  'tsconfig.json',
  'next.config.mjs',
  'tailwind.config.ts',
  '.gitignore',
  'README.md',
  'QUICKSTART.md'
];

console.log('\n✓ Checking configuration files...');
configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.error(`  ✗ ${file} missing!`);
    hasErrors = true;
  }
});

// Check docs structure
console.log('\n✓ Checking documentation structure...');
const docCategories = [
  'docs/introduction',
  'docs/frontend',
  'docs/backend',
  'docs/database',
  'docs/authentication',
  'docs/deployment',
  'docs/best-practices'
];

docCategories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`  ✓ ${dir}/`);
  } else {
    console.error(`  ✗ ${dir}/ missing!`);
    hasErrors = true;
  }
});

// Check sample MDX files
console.log('\n✓ Checking sample documentation files...');
const sampleDocs = [
  'docs/introduction/what-is-fullstack.mdx',
  'docs/introduction/modern-stack.mdx',
  'docs/frontend/fundamentals.mdx',
  'docs/backend/building-apis.mdx',
  'docs/authentication/nextauth-jwt.mdx',
  'docs/database/prisma-postgresql.mdx',
  'docs/deployment/vercel-railway.mdx',
  'docs/best-practices/project-structure.mdx'
];

sampleDocs.forEach(doc => {
  if (fs.existsSync(doc)) {
    console.log(`  ✓ ${doc}`);
  } else {
    console.error(`  ✗ ${doc} missing!`);
    hasErrors = true;
  }
});

// Check source structure
console.log('\n✓ Checking source code structure...');
const sourceDirs = [
  'src/app',
  'src/components',
  'src/lib'
];

sourceDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`  ✓ ${dir}/`);
  } else {
    console.error(`  ✗ ${dir}/ missing!`);
    hasErrors = true;
  }
});

// Check key source files
console.log('\n✓ Checking key source files...');
const keyFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'src/lib/parseFrontmatter.ts',
  'src/lib/readDocsMetadata.ts',
  'src/components/ui/button.tsx',
  'src/components/docs/code-block.tsx',
  'src/components/layout/navbar.tsx'
];

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.error(`  ✗ ${file} missing!`);
    hasErrors = true;
  }
});

// Check node_modules
console.log('\n✓ Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('  ✓ node_modules/ exists');
  
  // Check critical packages
  const criticalPackages = [
    'next',
    'react',
    'typescript',
    'tailwindcss',
    '@mdx-js/react'
  ];
  
  criticalPackages.forEach(pkg => {
    if (fs.existsSync(`node_modules/${pkg}`)) {
      console.log(`    ✓ ${pkg}`);
    } else {
      console.warn(`    ⚠ ${pkg} not installed (run: npm install)`);
    }
  });
} else {
  console.warn('  ⚠ node_modules/ not found!');
  console.log('    Run: npm install');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ Verification completed with errors.');
  console.log('\nPlease review the missing files above and ensure they exist.');
  process.exit(1);
} else {
  console.log('✅ All files verified successfully!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm install');
  console.log('   2. Run: npm run dev');
  console.log('   3. Open: http://localhost:3000');
  console.log('\n📚 Read QUICKSTART.md for more details.\n');
  process.exit(0);
}
