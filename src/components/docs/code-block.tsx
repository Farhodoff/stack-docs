"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  title?: string;
  [key: string]: any;
}

export function CodeBlock({
  children,
  className = "",
  language,
  title,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  // Extract content and language if MDX passes a React element (like <pre> or <code>)
  let codeContent = children;
  let lang = language || "text";

  // Handle MDX rendering where children might be nested React elements
  if (typeof children === "object" && children !== null && !Array.isArray(children)) {
    const childObj = children as any;

    // If it's a pre or code element passed from MDX
    if (childObj.type === "pre" || childObj.type === "code") {
      const childProps = childObj.props || {};
      if (childProps.className?.startsWith("language-")) {
        lang = childProps.className.replace("language-", "");
      }
      codeContent = childProps.children || children;
    } else if (childObj.props?.className?.startsWith("language-")) {
      lang = childObj.props.className.replace("language-", "");
      codeContent = childObj.props.children || children;
    }
  }

  // Extract raw text content for copying
  const getTextContent = (node: any): string => {
    if (typeof node === 'string') {
      return node;
    }
    if (typeof node === 'object' && node !== null) {
      if (Array.isArray(node)) {
        return node.map(getTextContent).join('');
      }
      if (node.props?.children) {
        return getTextContent(node.props.children);
      }
    }
    return '';
  };

  const copyToClipboard = async () => {
    try {
      const text = getTextContent(codeContent);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-border/60 bg-muted/30 shadow-sm hover:shadow-md transition-shadow duration-200">
      {(title || lang) && (
        <div className="flex items-center justify-between border-b border-border/40 bg-gradient-to-r from-muted/60 to-muted/40 px-4 py-2.5">
          <div className="flex items-center gap-2">
            {title && (
              <span className="text-sm font-semibold text-foreground/90">
                {title}
              </span>
            )}
            {!title && lang && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#534AB7]" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {lang}
                </span>
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-7 w-7 p-0 hover:bg-muted/60"
            title="Copy code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>
      )}

      <div className="relative">
        <pre
          className={cn(
            "overflow-x-auto p-4 text-sm leading-relaxed",
            "bg-gradient-to-br from-muted/20 to-muted/10",
            "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
            className
          )}
          {...props}
        >
          <code
            className={cn(
              "block font-mono text-foreground/90",
              "selection:bg-[#534AB7]/20 selection:text-foreground",
              lang && `language-${lang}`,
            )}
          >
            {codeContent}
          </code>
        </pre>
      </div>
    </div>
  );
}
