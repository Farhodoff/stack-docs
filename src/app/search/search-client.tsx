"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, FileText, Clock } from "lucide-react";

interface SearchDocument {
  slug: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  content: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  readTime?: number;
}

interface SearchClientProps {
  index: SearchDocument[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

const getDifficultyLabel = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner':
      return '🟢 Boshlang\'ich'
    case 'intermediate':
      return '🟡 O\'rta'
    case 'advanced':
      return '🔴 Murakkab'
    default:
      return null
  }
}

export function SearchClient({ index }: SearchClientProps) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(index, {
      keys: [
        { name: "title", weight: 2 },
        { name: "description", weight: 1.5 },
        { name: "tags", weight: 1.2 },
        { name: "category", weight: 1 },
        { name: "content", weight: 0.5 },
      ],
      threshold: 0.3,
      includeMatches: true,
    });
  }, [index]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map(result => result.item);
  }, [query, fuse]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documentation..."
          className="pl-10 h-14 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="space-y-4">
        {query.trim() && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No results found for &quot;{query}&quot;. Try different keywords.
          </div>
        )}

        {results.map((item) => (
          <Link key={item.slug} href={`/docs/${item.slug}`} className="block mb-4">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {item.title}
                  </CardTitle>
                  {item.category && (
                    <Badge variant="secondary">{item.category}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 mb-3 flex-wrap">
                  {item.readTime && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {item.readTime} min
                    </div>
                  )}
                  {item.difficulty && (
                    <Badge className={DIFFICULTY_COLORS[item.difficulty]}>
                      {getDifficultyLabel(item.difficulty)}
                    </Badge>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
