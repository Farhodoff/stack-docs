-- Stack Docs Platform - Sample Data Migration
-- File: supabase/migrations/002_insert_sample_data.sql

-- ============================================================================
-- SAMPLE DATA FOR STACK DOCS PLATFORM
-- ============================================================================

-- Insert sample courses
INSERT INTO courses (id, name, slug, title, description, icon, color, difficulty, estimated_hours, status, sort_order, is_published) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'html-css', 'html-css', 'HTML & CSS Fundamentals', 'Web development basics with HTML and CSS', '🎨', '#f06292', 'BEGINNER', 20, 'PUBLISHED', 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'javascript', 'javascript', 'JavaScript Programming', 'Learn modern JavaScript from basics to advanced', '🟨', '#f7df1e', 'INTERMEDIATE', 25, 'PUBLISHED', 2, true),
('550e8400-e29b-41d4-a716-446655440003', 'react', 'react', 'React Development', 'Build modern web applications with React', '⚛️', '#61dafb', 'INTERMEDIATE', 30, 'PUBLISHED', 3, true),
('550e8400-e29b-41d4-a716-446655440004', 'nodejs', 'nodejs', 'Node.js Backend', 'Server-side JavaScript with Node.js', '🟢', '#339933', 'ADVANCED', 35, 'PUBLISHED', 4, true),
('550e8400-e29b-41d4-a716-446655440005', 'database', 'database', 'Database Systems', 'Master PostgreSQL and database design', '🗄️', '#f59e0b', 'ADVANCED', 28, 'PUBLISHED', 5, true);

-- Insert sample categories
INSERT INTO categories (id, course_id, name, slug, parent_id, icon, description, sort_order, is_published) VALUES
-- HTML/CSS Categories
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Introduction', 'introduction', null, '📖', 'Getting started with HTML & CSS', 1, true),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Core Concepts', 'core-concepts', null, '🧱', 'Essential HTML and CSS concepts', 2, true),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Advanced Topics', 'advanced-topics', null, '🚀', 'Advanced styling techniques', 3, true),

-- JavaScript Categories
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Introduction', 'introduction', null, '📖', 'JavaScript fundamentals', 1, true),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Core Concepts', 'core-concepts', null, '⚡', 'Core JavaScript concepts', 2, true),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Advanced Topics', 'advanced-topics', null, '🔧', 'Advanced JavaScript features', 3, true),

-- React Categories
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Introduction', 'introduction', null, '📖', 'Getting started with React', 1, true),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'JSX Concepts', 'jsx-concepts', null, '🔧', 'Understanding JSX syntax', 2, true),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Components', 'components', null, '🧩', 'React components deep dive', 3, true),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'State Management', 'state-management', null, '📊', 'Managing application state', 4, true),

-- Node.js Categories
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'Introduction', 'introduction', null, '📖', 'Node.js fundamentals', 1, true),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', 'Core Modules', 'core-modules', null, '📦', 'Built-in Node.js modules', 2, true),
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 'Express.js', 'expressjs', null, '🚀', 'Web framework for Node.js', 3, true),

-- Database Categories
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440005', 'Introduction', 'introduction', null, '📖', 'Database fundamentals', 1, true),
('650e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440005', 'SQL Mastery', 'sql-mastery', null, '💾', 'Advanced SQL techniques', 2, true),
('650e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440005', 'ORM & Prisma', 'orm-prisma', null, '🔧', 'Object-Relational Mapping', 3, true);

-- Insert sample lessons
INSERT INTO lessons (id, course_id, category_id, title, slug, content, excerpt, difficulty, read_time, tags, lesson_number, sort_order, status, is_published) VALUES
-- React lessons
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440007', 'React Kirish', 'react-kirish', '# React Kirish

React - bu Facebook tomonidan yaratilgan JavaScript kutubxonasi. U foydalanuvchi interfeyslari (UI) yaratish uchun ishlatiladi.

## React ning asosiy xususiyatlari:

- **Component-based architecture**: UI ni qayta ishlatish mumkin bo''lgan komponentlarga bo''lish
- **Virtual DOM**: Samarali render qilish uchun
- **One-way data flow**: Ma''lumotlarning bir yo''nalishda oqishi
- **JSX syntax**: JavaScript ichida HTML yozish imkoniyati

## Birinchi React komponenti

```jsx
function Welcome() {
  return <h1>Salom, React!</h1>;
}
```

Bu oddiy komponenti yaratdi. Keyingi darslarda batafsilroq o''rganamiz.', 'React JavaScript kutubxonasi bilan tanishing va birinchi komponentni yarating', 'BEGINNER', 15, ARRAY['react', 'javascript', 'ui'], 1, 1, 'PUBLISHED', true),

('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440008', 'JSX Asoslari va Sintaksis', 'jsx-asoslari-sintaksis', '# JSX Asoslari va Sintaksis

JSX (JavaScript XML) - bu JavaScript kengaytmasi bo''lib, HTML ga o''xshash sintaksis bilan JavaScript kod yozish imkonini beradi.

## JSX nima?

JSX React-da UI yaratish uchun ishlatiladigan sintaksis. U HTML va JavaScript ning quvvatini birlashtiradi.

```jsx
const element = <h1>Salom, {name}!</h1>;
```

## JSX qoidalari

### 1. Bir root element
JSX ifodasi bitta root elementga ega bo''lishi kerak:

```jsx
// ✅ To''g''ri
return (
  <div>
    <h1>Sarlavha</h1>
    <p>Paragraf</p>
  </div>
);

// ❌ Noto''g''ri
return (
  <h1>Sarlavha</h1>
  <p>Paragraf</p>
);
```

### 2. JavaScript expressionlar
JSX ichida {} belgisi orqali JavaScript kodi yozish mumkin:

```jsx
const name = "Anvar";
const element = <h1>Salom, {name}!</h1>;
```

### 3. Attribute nomlari
JSX da ba''zi attribute nomlar HTML dan farq qiladi:

```jsx
// HTML
<div class="container" for="username"></div>

// JSX
<div className="container" htmlFor="username"></div>
```

## Conditional Rendering

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Xush kelibsiz!</h1>
      ) : (
        <h1>Iltimos tizimga kiring</h1>
      )}
    </div>
  );
}
```

## List Rendering

```jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Styling

### Inline styles
```jsx
const style = {
  color: "blue",
  fontSize: "20px"
};

<h1 style={style}>Matn</h1>
```

### CSS classes
```jsx
<div className="container main-content">
  <h1>Content</h1>
</div>
```

## Amaliy mashq

Quyidagi komponenti yarating:

```jsx
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {product.inStock ? (
        <button>Sotib olish</button>
      ) : (
        <button disabled>Sotildi</button>
      )}
    </div>
  );
}
```

JSX React ning asosiy qismi va uni yaxshi tushunish muhim. Keyingi darsda React komponentlari haqida o''rganamiz.', 'JSX sintaksi va React da HTML-JavaScript integration asoslarini o''rganing', 'BEGINNER', 25, ARRAY['jsx', 'react', 'syntax'], 2, 2, 'PUBLISHED', true),

('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440009', 'React komponentlari', 'react-komponentlari', '# React Komponentlari

Komponentlar React ning asosiy building block''lari hisoblanadi. Ular qayta foydalanish mumkin bo''lgan UI qismlari yaratish imkonini beradi.

## Komponent turlari

### 1. Function Components

```jsx
function Welcome(props) {
  return <h1>Salom, {props.name}!</h1>;
}

// Arrow function syntax
const Welcome = (props) => {
  return <h1>Salom, {props.name}!</h1>;
};
```

### 2. Class Components (eski usul)

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Salom, {this.props.name}!</h1>;
  }
}
```

Modern React da function componentlar tavsiya etiladi.

## Props (Properties)

Props komponentlarga ma''lumot uzatish usuli:

```jsx
function UserProfile({ name, age, email, avatar }) {
  return (
    <div className="user-profile">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>Yosh: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

// Ishlatish
<UserProfile
  name="John Smith"
  age={25}
  email="john@example.com"
  avatar="/images/john.jpg"
/>
```

## Children prop

```jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Ishlatish
<Card title="Mahsulot ma''lumoti">
  <p>Bu mahsulot haqida ma''lumot</p>
  <button>Sotib olish</button>
</Card>
```

## Default Props

```jsx
function Button({ text, color = "blue", size = "medium" }) {
  return (
    <button className={`btn btn-${color} btn-${size}`}>
      {text}
    </button>
  );
}
```

## PropTypes (type checking)

```jsx
import PropTypes from ''prop-types'';

function User({ name, age, isAdmin }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Yosh: {age}</p>
      {isAdmin && <span>Admin</span>}
    </div>
  );
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool
};
```

## Komponent kompozitsiyasi

```jsx
// Kichik komponentlar
function Avatar({ src, alt }) {
  return <img className="avatar" src={src} alt={alt} />;
}

function UserInfo({ user }) {
  return (
    <div className="user-info">
      <Avatar src={user.avatar} alt={user.name} />
      <div className="user-details">
        <div>{user.name}</div>
        <div>{user.email}</div>
      </div>
    </div>
  );
}

// Asosiy komponent
function Comment({ comment }) {
  return (
    <div className="comment">
      <UserInfo user={comment.author} />
      <div className="comment-text">
        {comment.text}
      </div>
      <div className="comment-date">
        {formatDate(comment.date)}
      </div>
    </div>
  );
}
```

## Conditional rendering

```jsx
function LoginButton({ isLoggedIn, onLogin, onLogout }) {
  if (isLoggedIn) {
    return <button onClick={onLogout}>Chiqish</button>;
  }

  return <button onClick={onLogin}>Kirish</button>;
}

// Yoki ternary operator
function LoginButton({ isLoggedIn, onLogin, onLogout }) {
  return (
    <button onClick={isLoggedIn ? onLogout : onLogin}>
      {isLoggedIn ? "Chiqish" : "Kirish"}
    </button>
  );
}
```

## Amaliy loyiha: Blog Card komponenti

```jsx
function BlogCard({ post, onReadMore, onLike }) {
  return (
    <article className="blog-card">
      <img
        src={post.featuredImage}
        alt={post.title}
        className="blog-image"
      />

      <div className="blog-content">
        <div className="blog-meta">
          <span className="category">{post.category}</span>
          <time className="date">{formatDate(post.publishedAt)}</time>
        </div>

        <h2 className="blog-title">{post.title}</h2>
        <p className="blog-excerpt">{post.excerpt}</p>

        <div className="blog-actions">
          <button
            className="btn-primary"
            onClick={() => onReadMore(post.id)}
          >
            To''liqini o''qish
          </button>

          <button
            className={`btn-like ${post.isLiked ? ''liked'' : ''''}`}
            onClick={() => onLike(post.id)}
          >
            ♥ {post.likesCount}
          </button>
        </div>

        <div className="blog-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

// Ishlatish
function BlogList({ posts }) {
  const handleReadMore = (postId) => {
    // Navigate to post detail
    console.log("Read post:", postId);
  };

  const handleLike = (postId) => {
    // Toggle like
    console.log("Like post:", postId);
  };

  return (
    <div className="blog-list">
      {posts.map(post => (
        <BlogCard
          key={post.id}
          post={post}
          onReadMore={handleReadMore}
          onLike={handleLike}
        />
      ))}
    </div>
  );
}
```

Komponentlar React ning eng muhim qismi. Ularni to''g''ri tushunish va ishlatish React ilovalar yaratishda asosdir.', 'React komponentlari, props va komponent kompozitsiyasi haqida to''liq ma''lumot', 'INTERMEDIATE', 30, ARRAY['components', 'props', 'react'], 3, 3, 'PUBLISHED', true);

-- Insert sample user (for testing)
INSERT INTO users (id, username, email, first_name, last_name, theme, language) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'testuser', 'test@example.com', 'Test', 'User', 'SYSTEM', 'uz');

-- Insert sample lesson progress
INSERT INTO lesson_progress (user_id, lesson_id, status, progress_percent, started_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'COMPLETED', 100, NOW() - INTERVAL '2 days'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'IN_PROGRESS', 75, NOW() - INTERVAL '1 day');

-- Insert sample bookmarks
INSERT INTO user_bookmarks (user_id, lesson_id, note) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 'Keyingi o''qish uchun saqlangan');

-- Insert sample comments
INSERT INTO comments (lesson_id, user_id, content, status) VALUES
('750e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', 'JSX sintaksini tushuntirish juda yaxshi. Rahmat!', 'APPROVED'),
('750e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440001', 'Komponentlar haqida batafsil yoritilgan.', 'APPROVED');