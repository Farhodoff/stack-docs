"use client"

import { MDXRemote } from 'next-mdx-remote';
import { Callout, Note, Tip, Warning, Danger } from "@/components/docs/callout";
import { LinkCard } from "@/components/docs/link-card";
import { CodeBlock } from "@/components/docs/code-block";

const components = {
  Callout,
  Note,
  Tip,
  Warning,
  Danger,
  LinkCard,
  CodeBlock,
  pre: (props: any) => <CodeBlock {...props} />,
  code: (props: any) => <code {...props} />,
  CardGroup: ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">{children}</div>
  ),
};

export default function MDXRenderer({ source }: { source: any }) {
  return <MDXRemote {...source} components={components} />
}
