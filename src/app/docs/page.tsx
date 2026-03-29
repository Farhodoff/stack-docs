import { getAllDocs, getCategories } from '@/lib/readDocsMetadata'
import { LessonCard } from '@/components/docs/lesson-card'
import { Book } from 'lucide-react'

export default function DocsIndexPage() {
  const categories = getCategories()

  return (
    <div className="container max-w-5xl py-12 px-6">
      <div className="relative mb-16 pb-8 border-b border-border/40">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shadow-inner">
            📚
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">Bilimlar Ombori</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dokumentatsiya
        </h1>
        <p className="text-lg text-muted-foreground/80 max-w-2xl leading-relaxed">
          Fullstack development dunyosiga xush kelibsiz. Bu yerda siz eng zamonaviy teхnologiyalar bo'yicha mukammal darsliklar va amaliy qo'llanmalarni topasiz.
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
