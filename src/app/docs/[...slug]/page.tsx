import { notFound } from "next/navigation";
import { getDocBySlug, getAllDocs, getPrevNextDocs } from "@/lib/readDocsMetadata";
import { renderMDX } from "@/lib/mdx-evaluate";
import fs from "fs";
import { ProgressBar } from "@/components/docs/progress-bar";
import { DocsPager } from "@/components/docs/pager";
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

  const { prev, next } = getPrevNextDocs(slugStr);
  const fileContent = fs.readFileSync(doc.filePath, "utf-8");
  const contentWithoutFrontmatter = fileContent
    .replace(/^---\s*\n([\s\S]*?)\n---/, "")
    .trim();

  const serialized = await renderMDX(contentWithoutFrontmatter);

  return (
    <>
      <ProgressBar />
      <div className="w-full pb-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-xl text-muted-foreground">{doc.description}</p>
          )}
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none w-full">
          <MDXRenderer source={serialized} />
        </article>

        <DocsPager prev={prev} next={next} />
      </div>
    </>
  );
}
