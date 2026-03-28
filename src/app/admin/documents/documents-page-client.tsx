'use client'

import { useState, useMemo, useEffect } from 'react'
import { DocList } from '@/components/admin/doc-list'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllCategoriesAction } from '@/app/admin/actions'

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

interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export default function DocumentsPage({ docs: initialDocs }: DocumentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [docs, setDocs] = useState<Document[]>(initialDocs)

  // Load categories from server
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getAllCategoriesAction()
      setCategories(cats || [])
    }
    loadCategories()
  }, [])

  // Handle document deletion from UI
  const handleDocumentDeleted = (slug: string) => {
    setDocs(prevDocs => prevDocs.filter(doc => doc.slug !== slug))
  }

  // Get unique categories - prioritize from loaded categories, fallback to docs
  const uniqueCategories = useMemo(() => {
    if (categories.length > 0) {
      return categories.filter(cat =>
        docs.some(doc => doc.category === cat.id)
      )
    }
    // Fallback for docs without categories.json
    return Array.from(new Set(docs.map(doc => doc.category))).map(id => ({
      id: id as string,
      name: id as string,
      color: '#6366f1',
      icon: '📁'
    }))
  }, [categories, docs])

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
          <h2 className="text-2xl font-bold">📄 Barcha Hujjatlar</h2>
          <p className="text-muted-foreground">
            Hujjatlarni boshqarish va o'rganish
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Hujjat Qo'shish
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Hujjatlarni izlash..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Barchasi
          </Button>
          {uniqueCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              style={
                selectedCategory === category.id
                  ? { backgroundColor: category.color }
                  : {
                      borderColor: category.color,
                      color: 'inherit',
                    }
              }
              className="transition-all whitespace-nowrap"
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredDocs.length} ta, Jami {docs.length} ta hujjat
      </div>

      {/* Document list */}
      <DocList docs={filteredDocs} onDocumentDeleted={handleDocumentDeleted} />
    </div>
  )
}
