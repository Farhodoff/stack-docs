import { getAllDocs, getCategories } from '@/lib/readDocsMetadata'
import { LessonCard } from '@/components/docs/lesson-card'
import { Book } from 'lucide-react'

export default function DocsIndexPage() {
  const categories = getCategories()

  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">📚 Dokumentatsiya</h1>
        <p className="text-xl text-muted-foreground">
          Fullstack development uchun to'liq qo'llanmalar va darsliklar
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(categories).map(([categoryName, docs]) => (
          <section key={categoryName}>
            <div className="flex items-center gap-2 mb-6">
              <Book className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold capitalize">{categoryName}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {docs.map((doc) => (
                <LessonCard
                  key={doc.slug}
                  slug={doc.slug}
                  title={doc.title}
                  description={doc.description}
                  category={doc.category || categoryName}
                  order={doc.order}
                  tags={doc.tags}
                  difficulty={doc.difficulty}
                  readTime={doc.readTime}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
