import { notFound } from "next/navigation";
import { getDocBySlug, getAllDocs, getPrevNextDocs } from "@/lib/readDocsMetadata";
import { renderMDX } from "@/lib/mdx-evaluate";
import fs from "fs";
import { ProgressBar } from "@/components/docs/progress-bar";
import { DocsPager } from "@/components/docs/pager";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import MDXRenderer from "@/components/docs/mdx-renderer";

// Skip static generation and use on-demand rendering
export const dynamic = "force-dynamic";

export default async function DocPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const slugStr = params.slug.join("/");
  const doc = getDocBySlug(slugStr);

  if (!doc) {
    notFound();
  }

  // Get prev/next docs WITHIN THE SAME CATEGORY
  const { prev, next } = getPrevNextDocs(slugStr, doc.category);

  const fileContent = fs.readFileSync(doc.filePath, "utf-8");
  const contentWithoutFrontmatter = fileContent
    .replace(/^---\s*\n([\s\S]*?)\n---/, "")
    .trim();

  const serialized = await renderMDX(contentWithoutFrontmatter);

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: "Hujjatlar", href: "/docs" },
    ...(doc.category ? [{ label: doc.category }] : []),
    { label: doc.title }
  ];

  return (
    <>
      <ProgressBar />
      <div className="w-full">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Page Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-2xl font-medium tracking-tight leading-tight">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-base text-muted-foreground leading-relaxed">
              {doc.description}
            </p>
          )}
        </div>

        {/* Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none w-full prose-headings:font-medium prose-p:leading-relaxed prose-li:leading-relaxed">
          <MDXRenderer source={serialized} />
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <DocsPager prev={prev} next={next} />
        </div>
      </div>
    </>
  );
}
