# Stack Docs Database Setup Guide

Bu guide sizning Stack Docs loyihangizdagi oddiy `documents` jadvalidan to'liq **learning platform schema**'ga o'tishda yordam beradi.

## 🎯 Nimani o'zgartiramiz?

### ❌ **Oldingi holat:**

```sql
documents jadval (oddiy struktura)
```

### ✅ **Yangi holat:**

```sql
courses → categories → lessons
users → progress → bookmarks → notes → comments
search_queries, lesson_views, content_versions
```

## 📋 **Prerequisites**

1. **Supabase project** sozlangan bo'lishi kerak
2. **Environment variables** to'g'ri o'rnatilgan:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## 🚀 **Migration Jarayoni**

### 1. **Backup yarating (muhim!)**

```sql
-- Hozirgi documents jadvalini backup qiling
CREATE TABLE documents_backup AS SELECT * FROM documents;
```

### 2. **Environment tekshiring**

```bash
# .env faylini tekshiring
cat .env

# Kerakli o'zgaruvchilar mavjud ekanligini tasdiqlang:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. **Migration'larni ishga tushiring**

#### Usul 1: JavaScript script (tavsiya etiladi)

```bash
# Migration ishga tushirish
node migrate.js migrate

# Natijani tekshirish
node migrate.js test
```

#### Usul 2: Manual SQL execution

Supabase Dashboard > SQL Editor'da quyidagi fayllarni ketma-ket ishga tushiring:

1. `supabase/migrations/001_create_stackdocs_schema.sql`
2. `supabase/migrations/002_insert_sample_data.sql`

### 4. **Migration'ni tekshirish**

```sql
-- Jadvallar yaratilganini tekshiring
\dt

-- Ma'lumotlar mavjudligini tekshiring
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM lessons;
SELECT COUNT(*) FROM categories;
```

## 📊 **Yangi Database Schema**

### **Asosiy jadvallar:**

```text
📚 courses (5 ta course)
├── 🎨 html-css (HTML & CSS Fundamentals)
├── 🟨 javascript (JavaScript Programming)
├── ⚛️ react (React Development)
├── 🟢 nodejs (Node.js Backend)
└── 🗄️ database (Database Systems)

📂 categories (har bir course uchun)
├── 📖 Introduction
├── 🧱 Core Concepts
└── 🚀 Advanced Topics

📄 lessons (3+ ta sample lesson)
├── React Kirish
├── JSX Asoslari va Sintaksis
└── React komponentlari

👤 users (authentication va progress)
📈 lesson_progress (o'qish progress)
🔖 user_bookmarks (saqlangan darslar)
📝 user_notes (shaxsiy eslatmalar)
💬 comments (community features)
```

## 🧪 **Test Queries**

Migration'dan so'ng bu query'lar ishishi kerak:

```sql
-- 1. Hierarchical navigation
SELECT c.name, cat.name, l.title, l.lesson_number
FROM courses c
JOIN categories cat ON c.id = cat.course_id
JOIN lessons l ON cat.id = l.category_id
ORDER BY c.sort_order, cat.sort_order, l.lesson_number;

-- 2. Full-text search
SELECT l.title, l.excerpt, ts_rank(...) as rank
FROM lessons l
WHERE to_tsvector('english', l.title || ' ' || l.content)
      @@ plainto_tsquery('english', 'JSX');

-- 3. User progress
SELECT c.name, COUNT(l.id) as total_lessons,
       COUNT(lp.id) FILTER (WHERE lp.status = 'COMPLETED') as completed_lessons
FROM courses c
JOIN lessons l ON c.id = l.course_id
LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
GROUP BY c.id, c.name;
```

## 🔧 **API Integration**

### **Supabase Client Setup**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Database types (auto-generated)
export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          name: string
          slug: string
          title: string
          // ... other fields
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          // ... other fields
        }
      }
      // ... other tables
    }
  }
}
```

### **API Endpoints uchun misollar**

```typescript
// Get course structure
export async function getCourseStructure(courseSlug: string) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      categories (
        *,
        lessons (
          id,
          title,
          slug,
          lesson_number,
          read_time,
          difficulty,
          is_published
        )
      )
    `)
    .eq('slug', courseSlug)
    .eq('is_published', true)
    .single()

  return { data, error }
}

// Get lesson with navigation
export async function getLesson(lessonSlug: string, userId?: string) {
  let query = supabase
    .from('lessons')
    .select(`
      *,
      courses (name, slug, icon),
      categories (name, slug)
    `)
    .eq('slug', lessonSlug)
    .eq('is_published', true)
    .single()

  const { data: lesson, error } = await query

  // Get user progress if logged in
  if (userId && lesson) {
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lesson.id)
      .single()

    return {
      data: { ...lesson, userProgress: progress },
      error
    }
  }

  return { data: lesson, error }
}

// Update lesson progress
export async function updateProgress(
  userId: string,
  lessonId: string,
  progress: Partial<LessonProgress>
) {
  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      ...progress,
      last_viewed_at: new Date().toISOString()
    })

  return { data, error }
}
```

## 🎨 **Frontend Components**

Design'ingizga mos komponentlar:

```typescript
// Sidebar Navigation
function CourseNav({ courseSlug }: { courseSlug: string }) {
  const [courseStructure, setCourseStructure] = useState(null)

  useEffect(() => {
    getCourseStructure(courseSlug).then(({ data }) => {
      setCourseStructure(data)
    })
  }, [courseSlug])

  return (
    <nav className="course-nav">
      {courseStructure?.categories.map(category => (
        <div key={category.id} className="category">
          <h3>{category.icon} {category.name}</h3>
          <ul>
            {category.lessons.map(lesson => (
              <li key={lesson.id}>
                <Link href={`/docs/${courseSlug}/${lesson.slug}`}>
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

// Breadcrumb
function Breadcrumb({ course, category, lesson }) {
  return (
    <nav className="breadcrumb">
      <Link href="/docs">Hujjatlar</Link>
      {' > '}
      <Link href={`/docs/${course.slug}`}>{course.name}</Link>
      {category && (
        <>
          {' > '}
          <span>{category.name}</span>
        </>
      )}
      {lesson && (
        <>
          {' > '}
          <span>{lesson.title}</span>
        </>
      )}
    </nav>
  )
}
```

## 📈 **Monitoring va Analytics**

```sql
-- Popular lessons
SELECT l.title, COUNT(lv.id) as views
FROM lessons l
LEFT JOIN lesson_views lv ON l.id = lv.lesson_id
WHERE lv.created_at > NOW() - INTERVAL '30 days'
GROUP BY l.id, l.title
ORDER BY views DESC;

-- User engagement
SELECT
  DATE(lp.last_viewed_at) as date,
  COUNT(DISTINCT lp.user_id) as active_users,
  COUNT(*) as total_views
FROM lesson_progress lp
WHERE lp.last_viewed_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(lp.last_viewed_at)
ORDER BY date DESC;
```

## ⚠️ **Migration Issues & Solutions**

### **Issue 1: Tables already exist**
```sql
-- Solution: Drop existing if needed (BACKUP FIRST!)
DROP TABLE IF EXISTS documents CASCADE;
```

### **Issue 2: Permission errors**
```bash
# Make sure you're using SERVICE ROLE KEY, not ANON KEY
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Issue 3: RLS policies**
```sql
-- Test if RLS is blocking queries
SELECT * FROM courses; -- Should work for public read

-- Check policies:
SELECT * FROM pg_policies WHERE tablename = 'courses';
```

### **Issue 4: Search not working**
```sql
-- Check if search indexes exist
\d lessons
-- Should show GIN indexes for full-text search
```

## 🎉 **Next Steps**

1. ✅ **Verify migration** - `node migrate.js test`
2. 🔄 **Update page components** to use new schema
3. 🔍 **Implement search** functionality
4. 📊 **Add progress tracking** to lesson pages
5. 💬 **Enable comments** system
6. 📱 **Test responsive design**

## 📞 **Support**

Schema yoki migration bilan bog'liq muammolar uchun:

1. **Error loglarni tekshiring** - Supabase Dashboard > Logs
2. **Queries test qiling** - `working-queries.sql` faylidan foydalaning
3. **Manual verification** - Supabase Dashboard > Table Editor

Migration muvaffaqiyatli bo'lsin! 🚀
