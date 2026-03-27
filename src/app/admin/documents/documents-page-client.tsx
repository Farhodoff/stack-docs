'use client'

import { useState, useMemo } from 'react'
import { DocList } from '@/components/admin/doc-list'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

interface Document {
  slug: string
  title: string
  description: string
  category: string
  order: number
  tags: string[]
  lastModified: Date
}

interface DocumentsPageProps {
  docs: Document[]
}

export default function DocumentsPage({ docs }: DocumentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(docs.map(doc => doc.category)))
  }, [docs])

  // Filter documents based on search and category
  const filteredDocs = useMemo(() => {
    return docs.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = !selectedCategory || doc.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [docs, searchQuery, selectedCategory])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">All Documents</h2>
          <p className="text-muted-foreground">
            Manage and organize your documentation
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Document
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredDocs.length} of {docs.length} documents
      </div>

      {/* Document list */}
      <DocList docs={filteredDocs} />
    </div>
  )
}
