"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocLink {
  slug: string;
  title: string;
  order?: number;
}

interface DocsPagerProps {
  prev: DocLink | null;
  next: DocLink | null;
}

export function DocsPager({ prev, next }: DocsPagerProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-8 mt-10 border-t">
      {/* Previous Button */}
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full sm:w-auto flex items-center gap-2 hover:bg-muted transition-colors group"
          )}
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              ← Oldingi Dars
            </span>
            <span className="font-semibold text-sm line-clamp-1">{prev.title}</span>
          </div>
        </Link>
      ) : (
        <div className="w-full sm:w-auto" />
      )}

      {/* Divider - visible only on desktop */}
      <div className="hidden sm:block w-px h-12 bg-border" />

      {/* Next Button */}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full sm:w-auto flex items-center gap-2 ml-0 sm:ml-auto hover:bg-muted transition-colors group"
          )}
        >
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Keyingi Dars →
            </span>
            <span className="font-semibold text-sm line-clamp-1">{next.title}</span>
          </div>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto" />
        </Link>
      ) : (
        <div className="w-full sm:w-auto" />
      )}
    </nav>
  );
}
