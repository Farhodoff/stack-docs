-- Stack Docs Platform - Complete Schema Migration
-- File: supabase/migrations/001_create_stackdocs_schema.sql

-- ============================================================================
-- Drop existing table if needed (backup first!)
-- ============================================================================
-- DROP TABLE IF EXISTS documents;

-- ============================================================================
-- USER MANAGEMENT & AUTHENTICATION
-- ============================================================================

-- Create custom user themes enum
CREATE TYPE user_theme AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,

  -- Profile
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar TEXT,
  bio TEXT,

  -- Preferences
  theme user_theme DEFAULT 'SYSTEM',
  language VARCHAR(10) DEFAULT 'uz',
  timezone VARCHAR(50) DEFAULT 'Asia/Tashkent',

  -- Account status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONTENT MANAGEMENT SYSTEM
-- ============================================================================

-- Create course enums
CREATE TYPE course_difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE course_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL, -- "React", "JavaScript"
  slug VARCHAR(100) UNIQUE NOT NULL, -- "react", "javascript"

  -- Content
  title VARCHAR(200) NOT NULL, -- "React Fundamentals"
  description TEXT,
  icon VARCHAR(10), -- "⚛️", "🟨"
  color VARCHAR(7), -- "#61dafb"

  -- Course metadata
  difficulty course_difficulty DEFAULT 'BEGINNER',
  estimated_hours INTEGER,

  -- Status and ordering
  status course_status DEFAULT 'DRAFT',
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

  -- Basic info
  name VARCHAR(100) NOT NULL, -- "Core Concepts", "Advanced Topics"
  slug VARCHAR(100) NOT NULL, -- "core-concepts"

  -- Hierarchy support
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,

  -- Display
  icon VARCHAR(10), -- "📚", "🔧"
  description TEXT,
  sort_order INTEGER DEFAULT 0,

  -- Status
  is_published BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(course_id, slug)
);

-- Create lesson enums
CREATE TYPE lesson_difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE lesson_status AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- Create lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Basic info
  title VARCHAR(200) NOT NULL, -- "JSX Asoslari va Sintaksis"
  slug VARCHAR(200) NOT NULL, -- "jsx-asoslari-sintaksis"

  -- Content
  content TEXT NOT NULL, -- MDX content
  excerpt TEXT, -- Short description

  -- Metadata
  difficulty lesson_difficulty DEFAULT 'BEGINNER',
  read_time INTEGER NOT NULL, -- minutes
  tags TEXT[] DEFAULT '{}', -- ["jsx", "react"]

  -- Lesson ordering
  lesson_number INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,

  -- Status
  status lesson_status DEFAULT 'DRAFT',
  is_published BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT true,

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Table of contents (extracted from content)
  table_of_contents JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(course_id, slug),
  UNIQUE(course_id, lesson_number)
);

-- ============================================================================
-- USER PROGRESS & LEARNING ANALYTICS
-- ============================================================================

CREATE TYPE progress_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- Create lesson progress table
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,

  -- Progress tracking
  status progress_status DEFAULT 'NOT_STARTED',
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  time_spent INTEGER DEFAULT 0, -- seconds

  -- Milestones
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_viewed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Reading position (for resume functionality)
  scroll_position FLOAT DEFAULT 0 CHECK (scroll_position >= 0 AND scroll_position <= 1),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, lesson_id)
);

-- Create user bookmarks table
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,

  note TEXT, -- User's personal note

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, lesson_id)
);

-- Create user notes table
CREATE TABLE user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,

  -- Note content
  content TEXT NOT NULL,

  -- Position in lesson (for contextual notes)
  anchor VARCHAR(100), -- Section anchor where note was made
  quote TEXT, -- Text selection that triggered the note

  -- Organization
  is_private BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMUNITY FEATURES
-- ============================================================================

CREATE TYPE comment_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SPAM');

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Comment content
  content TEXT NOT NULL,

  -- Threading support
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  -- Position in lesson
  anchor VARCHAR(100), -- Section where comment was made
  quote TEXT, -- Referenced text

  -- Moderation
  status comment_status DEFAULT 'PENDING',

  -- Engagement
  likes_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comment likes table
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(comment_id, user_id)
);

-- ============================================================================
-- SEARCH & ANALYTICS
-- ============================================================================

-- Create search queries table
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Results
  results_count INTEGER NOT NULL,
  clicked_result_id UUID, -- Which lesson was clicked

  -- Context
  course_id UUID REFERENCES courses(id),
  source VARCHAR(50), -- "global", "course", "lesson"

  -- Metadata
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lesson views table
CREATE TABLE lesson_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- View context
  source VARCHAR(50), -- "search", "navigation", "direct"
  referer TEXT,

  -- Engagement metrics
  time_spent INTEGER DEFAULT 0, -- seconds
  scroll_depth FLOAT DEFAULT 0 CHECK (scroll_depth >= 0 AND scroll_depth <= 1),

  -- Metadata
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONTENT VERSIONING & HISTORY
-- ============================================================================

-- Create content versions table
CREATE TABLE content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,

  -- Version info
  version VARCHAR(20) NOT NULL, -- "1.0.0", "1.1.0"
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,

  -- Change info
  change_note TEXT,
  author_id UUID REFERENCES users(id),

  -- Status
  is_published BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Course indexes
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_status ON courses(status, is_published);
CREATE INDEX idx_courses_featured ON courses(is_featured) WHERE is_featured = true;

-- Category indexes
CREATE INDEX idx_categories_course_id ON categories(course_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_categories_slug ON categories(course_id, slug);

-- Lesson indexes
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_category_id ON lessons(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX idx_lessons_slug ON lessons(course_id, slug);
CREATE INDEX idx_lessons_status ON lessons(status, is_published);
CREATE INDEX idx_lessons_number ON lessons(course_id, lesson_number);

-- Full-text search indexes
CREATE INDEX idx_lessons_title_fts ON lessons USING GIN(to_tsvector('english', title));
CREATE INDEX idx_lessons_content_fts ON lessons USING GIN(to_tsvector('english', content));

-- Progress indexes
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_status ON lesson_progress(status);

-- Comment indexes
CREATE INDEX idx_comments_lesson_id ON comments(lesson_id);
CREATE INDEX idx_comments_user_id ON comments(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_comments_status ON comments(status);

-- Analytics indexes
CREATE INDEX idx_search_queries_query ON search_queries(query);
CREATE INDEX idx_search_queries_user ON search_queries(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_lesson_views_lesson ON lesson_views(lesson_id);
CREATE INDEX idx_lesson_views_user ON lesson_views(user_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
CREATE POLICY "Public read published courses"
  ON courses FOR SELECT
  USING (status = 'PUBLISHED' AND is_published = true);

CREATE POLICY "Public read published categories"
  ON categories FOR SELECT
  USING (is_published = true AND course_id IN (
    SELECT id FROM courses WHERE status = 'PUBLISHED' AND is_published = true
  ));

CREATE POLICY "Public read published lessons"
  ON lessons FOR SELECT
  USING (status = 'PUBLISHED' AND is_published = true);

-- User-specific data policies
CREATE POLICY "Users can read/write their own progress"
  ON lesson_progress FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read/write their own bookmarks"
  ON user_bookmarks FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read/write their own notes"
  ON user_notes FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Comment policies
CREATE POLICY "Public read approved comments"
  ON comments FOR SELECT
  USING (status = 'APPROVED');

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can edit their own comments"
  ON comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notes_updated_at BEFORE UPDATE ON user_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comment likes count trigger
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_comment_likes_count
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();