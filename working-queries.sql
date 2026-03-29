-- Stack Docs Platform - Working SQL Queries
-- These queries will work after applying the new schema

-- ============================================================================
-- HIERARCHICAL COURSE STRUCTURE
-- ============================================================================

-- Get full course structure with categories and lessons
SELECT
  c.name as course_name,
  c.icon as course_icon,
  cat.name as category_name,
  cat.icon as category_icon,
  l.title as lesson_title,
  l.lesson_number,
  l.read_time,
  l.difficulty
FROM courses c
JOIN categories cat ON c.id = cat.course_id
JOIN lessons l ON cat.id = l.category_id
WHERE c.is_published = true AND l.is_published = true
ORDER BY c.sort_order, cat.sort_order, l.lesson_number;

-- ============================================================================
-- FULL-TEXT SEARCH ACROSS LESSONS
-- ============================================================================

-- Search lessons by title and content (Uzbek language support)
SELECT
  l.title,
  l.excerpt,
  l.slug,
  c.name as course_name,
  c.icon as course_icon,
  ts_rank(
    to_tsvector('english', l.title || ' ' || l.content),
    plainto_tsquery('english', $1)
  ) as rank
FROM lessons l
JOIN courses c ON l.course_id = c.id
WHERE l.is_published = true
  AND (
    to_tsvector('english', l.title || ' ' || l.content) @@ plainto_tsquery('english', $1)
    OR l.title ILIKE '%' || $1 || '%'
  )
ORDER BY rank DESC, l.created_at DESC
LIMIT 10;

-- Example usage:
-- Replace $1 with 'JSX' or 'React' or any search term

-- ============================================================================
-- COURSE PROGRESS PERCENTAGE
-- ============================================================================

-- Get course progress for a specific user
SELECT
  c.name,
  c.icon,
  c.title,
  COUNT(l.id) as total_lessons,
  COUNT(lp.id) FILTER (WHERE lp.status = 'COMPLETED') as completed_lessons,
  ROUND(
    (COUNT(lp.id) FILTER (WHERE lp.status = 'COMPLETED')::float / COUNT(l.id)) * 100
  ) as progress_percent,
  SUM(l.read_time) as total_read_time,
  SUM(CASE WHEN lp.status = 'COMPLETED' THEN l.read_time ELSE 0 END) as completed_read_time
FROM courses c
JOIN lessons l ON c.id = l.course_id
LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
WHERE c.is_published = true AND l.is_published = true
GROUP BY c.id, c.name, c.icon, c.title
ORDER BY c.sort_order;

-- Example: Replace $1 with user UUID like '850e8400-e29b-41d4-a716-446655440001'

-- ============================================================================
-- NAVIGATION QUERIES
-- ============================================================================

-- Get course navigation structure
SELECT
  c.id as course_id,
  c.name as course_name,
  c.slug as course_slug,
  c.icon,
  json_agg(
    json_build_object(
      'id', cat.id,
      'name', cat.name,
      'slug', cat.slug,
      'icon', cat.icon,
      'lessons', cat.lessons
    ) ORDER BY cat.sort_order
  ) as categories
FROM courses c
LEFT JOIN (
  SELECT
    cat.*,
    json_agg(
      json_build_object(
        'id', l.id,
        'title', l.title,
        'slug', l.slug,
        'lesson_number', l.lesson_number,
        'read_time', l.read_time,
        'difficulty', l.difficulty
      ) ORDER BY l.lesson_number
    ) as lessons
  FROM categories cat
  LEFT JOIN lessons l ON cat.id = l.category_id AND l.is_published = true
  GROUP BY cat.id
) cat ON c.id = cat.course_id
WHERE c.is_published = true
GROUP BY c.id
ORDER BY c.sort_order;

-- ============================================================================
-- USER DASHBOARD QUERIES
-- ============================================================================

-- Get user's recent activity
SELECT
  'progress' as activity_type,
  l.title as title,
  c.name as course_name,
  c.icon as course_icon,
  lp.status,
  lp.progress_percent,
  lp.last_viewed_at as timestamp
FROM lesson_progress lp
JOIN lessons l ON lp.lesson_id = l.id
JOIN courses c ON l.course_id = c.id
WHERE lp.user_id = $1
  AND lp.last_viewed_at > NOW() - INTERVAL '7 days'

UNION ALL

SELECT
  'bookmark' as activity_type,
  l.title,
  c.name as course_name,
  c.icon as course_icon,
  'bookmarked' as status,
  null as progress_percent,
  ub.created_at as timestamp
FROM user_bookmarks ub
JOIN lessons l ON ub.lesson_id = l.id
JOIN courses c ON l.course_id = c.id
WHERE ub.user_id = $1
  AND ub.created_at > NOW() - INTERVAL '7 days'

ORDER BY timestamp DESC
LIMIT 20;

-- ============================================================================
-- LESSON DETAIL QUERIES
-- ============================================================================

-- Get lesson with all details, navigation, and user progress
WITH lesson_navigation AS (
  SELECT
    l.id,
    LAG(l.id) OVER (PARTITION BY l.course_id ORDER BY l.lesson_number) as prev_lesson_id,
    LAG(l.title) OVER (PARTITION BY l.course_id ORDER BY l.lesson_number) as prev_lesson_title,
    LAG(l.slug) OVER (PARTITION BY l.course_id ORDER BY l.lesson_number) as prev_lesson_slug,
    LEAD(l.id) OVER (PARTITION BY l.course_id ORDER BY l.lesson_number) as next_lesson_id,
    LEAD(l.title) OVER (PARTITION BY l.course_id ORDER BY l.lesson_number) as next_lesson_title,
    LEAD(l.slug) OVER (PARTITION BY l.course_id ORDER BY l.lesson_number) as next_lesson_slug
  FROM lessons l
  WHERE l.is_published = true
)
SELECT
  l.*,
  c.name as course_name,
  c.slug as course_slug,
  c.icon as course_icon,
  cat.name as category_name,
  cat.slug as category_slug,
  lp.status as user_progress_status,
  lp.progress_percent as user_progress_percent,
  lp.scroll_position as user_scroll_position,
  CASE WHEN ub.id IS NOT NULL THEN true ELSE false END as is_bookmarked,
  ln.prev_lesson_id,
  ln.prev_lesson_title,
  ln.prev_lesson_slug,
  ln.next_lesson_id,
  ln.next_lesson_title,
  ln.next_lesson_slug
FROM lessons l
JOIN courses c ON l.course_id = c.id
LEFT JOIN categories cat ON l.category_id = cat.id
LEFT JOIN lesson_navigation ln ON l.id = ln.id
LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $2
LEFT JOIN user_bookmarks ub ON l.id = ub.lesson_id AND ub.user_id = $2
WHERE l.slug = $1 AND l.is_published = true;

-- Example: $1 = 'jsx-asoslari-sintaksis', $2 = user UUID

-- ============================================================================
-- ANALYTICS QUERIES
-- ============================================================================

-- Most popular lessons
SELECT
  l.title,
  l.slug,
  c.name as course_name,
  COUNT(lv.id) as view_count,
  COUNT(lp.id) FILTER (WHERE lp.status = 'COMPLETED') as completion_count,
  AVG(lp.progress_percent) as avg_progress
FROM lessons l
JOIN courses c ON l.course_id = c.id
LEFT JOIN lesson_views lv ON l.id = lv.lesson_id
LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id
WHERE l.is_published = true
  AND lv.created_at > NOW() - INTERVAL '30 days'
GROUP BY l.id, l.title, l.slug, c.name
ORDER BY view_count DESC
LIMIT 10;

-- Search analytics
SELECT
  query,
  COUNT(*) as search_count,
  AVG(results_count) as avg_results,
  COUNT(clicked_result_id) as click_count
FROM search_queries
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY query
ORDER BY search_count DESC
LIMIT 20;

-- ============================================================================
-- CONTENT MANAGEMENT QUERIES
-- ============================================================================

-- Get all courses with statistics
SELECT
  c.*,
  COUNT(DISTINCT cat.id) as categories_count,
  COUNT(DISTINCT l.id) as lessons_count,
  COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'PUBLISHED') as published_lessons_count,
  SUM(l.read_time) as total_read_time,
  COUNT(DISTINCT lp.user_id) as unique_learners
FROM courses c
LEFT JOIN categories cat ON c.id = cat.course_id
LEFT JOIN lessons l ON c.id = l.course_id
LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id
GROUP BY c.id
ORDER BY c.sort_order;

-- Get lessons that need review
SELECT
  l.title,
  l.slug,
  c.name as course_name,
  l.status,
  l.created_at,
  l.updated_at
FROM lessons l
JOIN courses c ON l.course_id = c.id
WHERE l.status IN ('DRAFT', 'REVIEW')
ORDER BY l.updated_at DESC;