import { getAllDocs, getCategories } from '@/lib/readDocsMetadata'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Book, ChevronRight } from 'lucide-react'

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
                <Link key={doc.slug} href={`/docs/${doc.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="group-hover:text-primary transition-colors">
                          {doc.title}
                        </span>
                        <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription>{doc.description}</CardDescription>
                    </CardHeader>
                    {doc.tags && doc.tags.length > 0 && (
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {doc.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
