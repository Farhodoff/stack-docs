import { Suspense } from "react";
import SearchPageContent from "./search-content";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Qidiruv</h2>
            <p className="text-muted-foreground">Hujjatlar orasidan qidiruv qilish</p>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded" />
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
