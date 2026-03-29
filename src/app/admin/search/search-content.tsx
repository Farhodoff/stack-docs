"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchDocsAction } from "@/app/admin/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  tags: string[];
  lastModified: Date;
  relevanceScore: number;
}

export default function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Extract unique categories and tags from results
  const extractMetadata = useCallback((docs: SearchResult[]) => {
    const categories = Array.from(new Set(docs.map((d) => d.category)));
    const tags = Array.from(new Set(docs.flatMap((d) => d.tags)));
    setAllCategories(categories);
    setAllTags(tags);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query && !category && selectedTags.length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchDocsAction({
          query: query || undefined,
          category: category !== "all" ? category : undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          sortBy: sortBy as any,
          sortOrder: sortOrder as any,
          limit: 50,
        });

        setResults(searchResults);
        extractMetadata(searchResults);
      } catch (error) {
        toast.error("Qidiruvda xatolik yuz berdi");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, category, selectedTags, sortBy, sortOrder, extractMetadata]);

  // Load initial data from URL params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setSelectedTags([]);
    setSortBy("relevance");
    router.push("/admin/search");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Qidiruv</h2>
        <p className="text-muted-foreground">
          Hujjatlar orasidan qidiruv qilish
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Hujjatlarni qidirish..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              title="Qidiruv matnini tozalash"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategoriya</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                title="Kategoriya tanlash"
              >
                <option value="all">Barchasi</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Saralash</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                title="Saralash usuli tanlash"
              >
                <option value="relevance">Moslik</option>
                <option value="date">Sana</option>
                <option value="order">Tartib</option>
                <option value="title">Sarlavha</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tartib</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                title="Saralash tartibi tanlash"
              >
                <option value="desc">Kamayish</option>
                <option value="asc">O'sish</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtrlarni tozalash
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium">Teglar</label>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 20).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {allTags.length > 20 && (
                  <Badge variant="outline">+{allTags.length - 20}</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Qidirilmoqda..."
              : `${results.length} ta natija topildi`}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Hech narsa topilmadi</p>
              <p className="text-sm">
                Boshqa kalit so'zlar bilan qidirib ko'ring
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((doc) => (
              <Card key={doc.slug} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{doc.title}</h3>
                        {doc.relevanceScore > 100 && (
                          <Badge variant="secondary" className="text-xs">
                            {(doc.relevanceScore / 10).toFixed(0)}% mos
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {doc.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <Badge variant="outline">{doc.category}</Badge>
                        <span>
                          {new Date(doc.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                      {doc.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {doc.tags.slice(0, 5).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-secondary"
                              onClick={() => handleTagToggle(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/edit/${doc.slug}`}>
                        <Button variant="outline" size="sm">
                          Tahrirlash
                        </Button>
                      </Link>
                      <Link href={`/docs/${doc.slug}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ko'rish
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
