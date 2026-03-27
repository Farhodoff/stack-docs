import { cn } from "@/lib/utils";

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

  return (
    <div className="my-6 overflow-hidden rounded-lg border bg-muted/30">
      {(title || lang) && (
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
          <div className="flex items-center gap-2">
            {title && (
              <span className="text-sm font-medium text-muted-foreground">
                {title}
              </span>
            )}
            {!title && lang && (
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {lang}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="relative">
        <pre
          className={cn("overflow-x-auto p-4 text-sm bg-muted/20", className)}
          {...props}
        >
          <code
            className={cn(
              "block font-mono leading-relaxed text-foreground",
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
