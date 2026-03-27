"use client";

import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { SidebarNavGroup } from "./docs-sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  items?: SidebarNavGroup[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>
        <MobileLink
          href="/docs/introduction/what-is-fullstack"
          className="flex items-center gap-2 font-bold text-xl mb-4"
          onOpenChange={setOpen}
        >
          <span className="text-primary">Fullstack</span>
          <span>Docs</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3 pb-4">
            <MobileLink
              href="/docs/introduction/what-is-fullstack"
              onOpenChange={setOpen}
              className="font-semibold pb-2"
            >
              Documentation
            </MobileLink>

            {items && items.length > 0 && (
              <div className="pt-4 border-t">
                {items.map((group, index) => (
                  <div key={index} className="pb-4">
                    <h4 className="mb-1 rounded-md py-1 text-sm font-semibold text-foreground">
                      {group.category}
                    </h4>
                    {group.items?.length > 0 && (
                      <div className="flex flex-col space-y-2 text-sm pl-2">
                        {group.items.map((item, itemIndex) => (
                          <MobileLink
                            key={itemIndex}
                            href={`/docs/${item.slug}`}
                            onOpenChange={setOpen}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {item.title}
                          </MobileLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
