"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, FileText } from "lucide-react";

interface SearchDocument {
  slug: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  content: string;
}

interface SearchClientProps {
  index: SearchDocument[];
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
                {item.tags && item.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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
