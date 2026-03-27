import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

export async function renderMDX(source: string) {
  try {
    const serialized = await serialize(source, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
        development: process.env.NODE_ENV === "development",
      },
    });

    return serialized;
  } catch (error: any) {
    console.error("MDX Rendering Error:", error?.message || error);
    if (error?.source) {
      console.error("Error source:", error.source);
    }
    throw error;
  }
}
