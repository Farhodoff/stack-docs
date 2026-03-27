'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'
import { deleteDocAction } from '@/app/admin/actions'
import { toast } from 'sonner'
import { DeleteDialog } from './delete-dialog'

interface DocListProps {
  docs: Array<{
    slug: string
    title: string
    description: string
    category: string
    order: number
    tags: string[]
    lastModified: Date
    status?: 'draft' | 'published'
  }>
}

export function DocList({ docs }: DocListProps) {
  const router = useRouter()
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deletingSlug) return
    
    try {
      const result = await deleteDocAction(deletingSlug)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Document deleted successfully')
        router.refresh()
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setDeletingSlug(null)
    }
  }

  const handleEdit = (slug: string) => {
    router.push(`/admin/edit/${slug}`)
  }

  const handlePreview = (slug: string) => {
    window.open(`/docs/${slug}`, '_blank')
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No documents found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              docs.map((doc) => (
                <TableRow key={doc.slug}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="flex items-center gap-2">
                        {doc.title}
                        {doc.status === 'published' && (
                          <Badge variant="default" className="text-xs">Published</Badge>
                        )}
                        {doc.status === 'draft' && (
                          <Badge variant="secondary" className="text-xs">Draft</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{doc.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.category}</Badge>
                  </TableCell>
                  <TableCell>{doc.order}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(doc.lastModified).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(doc.slug)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(doc.slug)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingSlug(doc.slug)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteDialog
        open={!!deletingSlug}
        onOpenChange={() => setDeletingSlug(null)}
        onConfirm={handleDelete}
        docTitle={docs.find(d => d.slug === deletingSlug)?.title || ''}
      />
    </>
  )
}
