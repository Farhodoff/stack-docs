-- Stack Docs - Test Queries (Working Versions)
-- Copy-paste these into Supabase Dashboard > SQL Editor

-- ============================================================================
-- 1. HIERARCHICAL COURSE STRUCTURE (Your original query - now working!)
-- ============================================================================
SELECT
  c.name as course_name,
  cat.name as category_name,
  l.title as lesson_title,
  l.lesson_number
FROM courses c
JOIN categories cat ON c.id = cat.course_id
JOIN lessons l ON cat.id = l.category_id
ORDER BY c.sort_order, cat.sort_order, l.lesson_number;

-- ============================================================================
-- 2. FULL-TEXT SEARCH (Your original query - now working!)
-- ============================================================================
SELECT
  l.title,
  l.excerpt,
  ts_rank(
    to_tsvector('english', l.title || ' ' || l.content),
    plainto_tsquery('english', 'JSX')
  ) as rank
FROM lessons l
WHERE to_tsvector('english', l.title || ' ' || l.content)
      @@ plainto_tsquery('english', 'JSX')
ORDER BY rank DESC;

-- Try different searches:
-- Replace 'JSX' with: 'React', 'component', 'JavaScript', 'syntax'

-- ============================================================================
-- 3. COURSE PROGRESS (Your original query - now working!)
-- ============================================================================
SELECT
  c.name,
  COUNT(l.id) as total_lessons,
  COUNT(lp.id) FILTER (WHERE lp.status = 'COMPLETED') as completed_lessons,
  ROUND((COUNT(lp.id) FILTER (WHERE lp.status = 'COMPLETED')::float / COUNT(l.id)) * 100) as progress_percent
FROM courses c
JOIN lessons l ON c.id = l.course_id
LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = '850e8400-e29b-41d4-a716-446655440001'
GROUP BY c.id, c.name
ORDER BY c.sort_order;

-- ============================================================================
-- 4. VERIFY SCHEMA CREATION
-- ============================================================================
-- Check all tables created
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name NOT LIKE 'pg_%'
  AND table_name NOT LIKE 'information_%'
ORDER BY table_name;

-- ============================================================================
-- 5. SAMPLE DATA VERIFICATION
-- ============================================================================
-- Count records in each table
SELECT
  'courses' as table_name,
  COUNT(*) as record_count,
  string_agg(name, ', ') as sample_names
FROM courses
UNION ALL
SELECT
  'categories' as table_name,
  COUNT(*) as record_count,
  string_agg(DISTINCT name, ', ') as sample_names
FROM categories
UNION ALL
SELECT
  'lessons' as table_name,
  COUNT(*) as record_count,
  string_agg(title, ', ') as sample_names
FROM lessons;

-- ============================================================================
-- 6. DETAILED COURSE STRUCTURE
-- ============================================================================
SELECT
  c.icon as course_icon,
  c.title as course_title,
  c.difficulty,
  c.estimated_hours,
  cat.icon as category_icon,
  cat.name as category,
  l.lesson_number,
  l.title as lesson,
  l.read_time,
  l.difficulty as lesson_difficulty
FROM courses c
LEFT JOIN categories cat ON c.id = cat.course_id
LEFT JOIN lessons l ON cat.id = l.category_id
WHERE c.is_published = true
ORDER BY c.sort_order, cat.sort_order, l.lesson_number;

-- ============================================================================
-- 7. SEARCH WITH COURSE CONTEXT
-- ============================================================================
SELECT
  c.name || ' > ' || l.title as full_path,
  l.excerpt,
  l.read_time,
  ts_rank(
    to_tsvector('english', l.title || ' ' || l.content),
    plainto_tsquery('english', 'component')
  ) as relevance
FROM lessons l
JOIN courses c ON l.course_id = c.id
WHERE l.is_published = true
  AND (
    l.title ILIKE '%component%' OR
    l.content ILIKE '%component%' OR
    to_tsvector('english', l.title || ' ' || l.content) @@ plainto_tsquery('english', 'component')
  )
ORDER BY relevance DESC, l.created_at DESC;

-- ============================================================================
-- 8. USER PROGRESS SIMULATION
-- ============================================================================
-- Get user's learning stats
SELECT
  u.username,
  COUNT(lp.id) as lessons_started,
  COUNT(lp.id) FILTER (WHERE lp.status = 'COMPLETED') as lessons_completed,
  SUM(lp.time_spent) / 60 as total_minutes_spent,
  COUNT(ub.id) as bookmarked_lessons,
  COUNT(c.id) as total_comments
FROM users u
LEFT JOIN lesson_progress lp ON u.id = lp.user_id
LEFT JOIN user_bookmarks ub ON u.id = ub.user_id
LEFT JOIN comments c ON u.id = c.user_id
WHERE u.username = 'testuser'
GROUP BY u.id, u.username;

-- ============================================================================
-- 9. ADVANCED NAVIGATION QUERY
-- ============================================================================
-- Get full navigation structure as JSON
SELECT
  c.name as course,
  json_agg(
    json_build_object(
      'categoryName', cat.name,
      'categoryIcon', cat.icon,
      'lessons', cat_lessons.lessons
    ) ORDER BY cat.sort_order
  ) as structure
FROM courses c
LEFT JOIN categories cat ON c.id = cat.course_id
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'number', l.lesson_number,
      'title', l.title,
      'slug', l.slug,
      'readTime', l.read_time,
      'difficulty', l.difficulty
    ) ORDER BY l.lesson_number
  ) as lessons
  FROM lessons l
  WHERE l.category_id = cat.id AND l.is_published = true
) cat_lessons ON true
WHERE c.is_published = true
GROUP BY c.id, c.name
ORDER BY c.sort_order;

-- ============================================================================
-- 10. PERFORMANCE TEST QUERIES
-- ============================================================================
-- Test full-text search performance
EXPLAIN (ANALYZE, BUFFERS)
SELECT l.title, l.excerpt
FROM lessons l
WHERE to_tsvector('english', l.title || ' ' || l.content)
      @@ plainto_tsquery('english', 'React');

-- Test join performance
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.name, cat.name, l.title
FROM courses c
JOIN categories cat ON c.id = cat.course_id
JOIN lessons l ON cat.id = l.category_id
ORDER BY c.sort_order, cat.sort_order, l.lesson_number;