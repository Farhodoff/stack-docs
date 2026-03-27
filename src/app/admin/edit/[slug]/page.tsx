import { notFound } from 'next/navigation'
import { getDocBySlugAction } from '@/app/admin/actions'
import { DocForm } from '@/components/admin/doc-form'

interface EditDocPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditDocPage({ params }: EditDocPageProps) {
  const { slug } = await params
  const doc = await getDocBySlugAction(slug)

  if (!doc) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Documentation</h2>
        <p className="text-muted-foreground">
          Editing: {doc.frontmatter.title}
        </p>
      </div>
      
      <DocForm mode="edit" initialData={doc} />
    </div>
  )
}
