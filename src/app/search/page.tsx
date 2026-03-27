import { Metadata } from "next";
import { buildSearchIndex } from "@/lib/buildSearchIndex";
import { SearchClient } from "./search-client";

export const metadata: Metadata = {
  title: "Search | Fullstack Docs",
  description: "Search the documentation for Fullstack Docs",
};

export default async function SearchPage() {
  // Generate the search index on the server
  const index = buildSearchIndex();

  return (
    <div className="container max-w-4xl py-10 mx-auto">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl font-bold tracking-tight lg:text-5xl">
            Search Documentation
          </h1>
          <p className="text-xl text-muted-foreground">
            Instantly search across all our guides, tutorials, and API references.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      <div className="mt-8">
        <SearchClient index={index} />
      </div>
    </div>
  );
}
