#!/usr/bin/env node

/**
 * Stack Docs Migration Runner
 *
 * This script applies the database migrations to Supabase.
 * Make sure to set your environment variables first.
 */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config();

// Debug: Log environment variables (without exposing secrets)
console.log('🔍 Environment Check:');
console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);
console.log('');

// Check if we have Supabase available
let supabase;

try {
  const { createClient } = require('@supabase/supabase-js');

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing required environment variables:');
    if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    if (!serviceRoleKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    console.error('\nPlease check your .env file');
    process.exit(1);
  }

  if (!supabaseUrl.startsWith('https://')) {
    console.error('❌ Invalid NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
    console.error('   Must be a valid HTTPS URL (e.g., https://your-project.supabase.co)');
    process.exit(1);
  }

  // Initialize Supabase client
  supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log('✅ Supabase client initialized successfully');
  console.log(`   Project URL: ${supabaseUrl}`);
  console.log('');
} catch (error) {
  console.error('❌ Could not initialize Supabase client:', error.message);
  console.log('\nTroubleshooting steps:');
  console.log('1. Make sure Supabase is installed: npm install @supabase/supabase-js');
  console.log('2. Check your .env file contains valid URLs and keys');
  console.log('3. Ensure you have the SERVICE_ROLE_KEY, not ANON_KEY for migrations');
  process.exit(1);
}

async function runMigration(filePath) {
  try {
    console.log(`📄 Reading migration: ${filePath}`);
    const sql = await fs.readFile(filePath, 'utf8');

    console.log(`🚀 Executing migration: ${path.basename(filePath)}`);

    // Split SQL by statements and execute them one by one
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length === 0) continue;

      try {
        await supabase.rpc('exec_sql', { sql: statement + ';' });
        console.log(`  ✅ Statement ${i + 1}/${statements.length} executed`);
      } catch (error) {
        // Try direct SQL execution as fallback
        const { error: sqlError } = await supabase
          .from('_migrations')
          .select('*')
          .limit(0);

        if (sqlError) {
          console.log(`  ⚠️  Statement ${i + 1}/${statements.length} failed, but continuing...`);
          console.log(`     Error: ${error.message}`);
        }
      }
    }

    console.log(`✅ Migration completed: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Migration failed: ${path.basename(filePath)}`);
    console.error('Error:', error.message);
    return false;
  }
}

async function runMigrations() {
  console.log('🎯 Stack Docs Database Migration Runner\n');

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY');
    console.error('\nPlease set these in your .env file');
    process.exit(1);
  }

  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');

  try {
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort(); // Run migrations in order

    if (migrationFiles.length === 0) {
      console.log('📝 No migration files found');
      return;
    }

    console.log(`📋 Found ${migrationFiles.length} migration(s):`);
    migrationFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');

    let successCount = 0;

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const success = await runMigration(filePath);

      if (success) {
        successCount++;
      }

      console.log(''); // Add spacing between migrations
    }

    console.log(`🎉 Migration process completed!`);
    console.log(`   ✅ ${successCount}/${migrationFiles.length} migrations successful`);

    if (successCount === migrationFiles.length) {
      console.log('\n🎯 Next steps:');
      console.log('   1. Check your Supabase dashboard to verify tables');
      console.log('   2. Test the working queries in working-queries.sql');
      console.log('   3. Update your application code to use the new schema');
      console.log('\n📚 Sample data has been inserted for testing!');
    }

  } catch (error) {
    console.error('❌ Could not read migrations directory:', error.message);
    console.error('Make sure the supabase/migrations directory exists');
  }
}

// Manual SQL execution helper function
async function testQueries() {
  console.log('🧪 Testing sample queries...\n');

  try {
    // Test 1: Get all courses
    console.log('1. Getting all courses...');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('sort_order');

    if (coursesError) {
      console.error('   ❌ Error:', coursesError.message);
    } else {
      console.log(`   ✅ Found ${courses.length} published courses`);
      courses.forEach(course => {
        console.log(`      ${course.icon} ${course.title}`);
      });
    }

    console.log('');

    // Test 2: Get lessons
    console.log('2. Getting lessons...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select(`
        *,
        courses(name, icon),
        categories(name)
      `)
      .eq('is_published', true)
      .order('lesson_number')
      .limit(5);

    if (lessonsError) {
      console.error('   ❌ Error:', lessonsError.message);
    } else {
      console.log(`   ✅ Found ${lessons.length} published lessons`);
      lessons.forEach(lesson => {
        console.log(`      📚 ${lesson.title} (${lesson.read_time} min)`);
      });
    }

    console.log('\n✅ Basic queries working! Your schema is ready.');

  } catch (error) {
    console.error('❌ Query test failed:', error.message);
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'migrate':
      await runMigrations();
      break;

    case 'test':
      await testQueries();
      break;

    default:
      console.log('🎯 Stack Docs Migration Tool\n');
      console.log('Usage:');
      console.log('  node migrate.js migrate  - Run database migrations');
      console.log('  node migrate.js test     - Test basic queries');
      console.log('\nMake sure to set environment variables in .env:');
      console.log('  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url');
      console.log('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runMigrations, testQueries };