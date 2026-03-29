import { notFound } from "next/navigation";
import { getDocBySlug, getPrevNextDocs } from "@/lib/readDocsMetadata";
import fs from "fs";
import { ProgressBar } from "@/components/docs/progress-bar";
import { DocsPager } from "@/components/docs/pager";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { extractBody } from "@/lib/parseFrontmatter";
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from "@/components/docs/mdx-components";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

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
  const contentWithoutFrontmatter = extractBody(fileContent);

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
        <div className="mb-10 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight leading-tight text-foreground/95 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {doc.description}
            </p>
          )}
        </div>

        {/* Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none w-full prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-7 prose-p:text-foreground/80 prose-li:leading-7 prose-li:text-foreground/80 prose-strong:text-foreground prose-strong:font-semibold prose-code:text-[#534AB7] prose-code:bg-muted/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-medium prose-code:text-sm prose-blockquote:border-l-[#534AB7] prose-blockquote:bg-gradient-to-r prose-blockquote:from-muted/40 prose-blockquote:to-transparent prose-blockquote:not-italic prose-a:text-[#534AB7] prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:decoration-2 prose-a:underline-offset-4 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h2:mt-8 prose-h2:mb-4 prose-h3:mt-6 prose-h3:mb-3 prose-h4:mt-4 prose-h4:mb-2 text-foreground/90">
          <MDXRemote 
            source={contentWithoutFrontmatter} 
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              }
            }}
          />
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <DocsPager prev={prev} next={next} />
        </div>
      </div>
    </>
  );
}
