import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocLink {
  slug: string;
  title: string;
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
    <div className="flex flex-row items-center justify-between pt-8 mt-10 border-t">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className={cn(buttonVariants({ variant: "outline" }), "flex gap-2")}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className={cn(buttonVariants({ variant: "outline" }), "flex gap-2 ml-auto")}
        >
          <span>{next.title}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
