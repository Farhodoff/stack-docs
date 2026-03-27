import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { getNavigationItems } from "@/lib/readDocsMetadata";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fullstack Docs - Learn Modern Web Development",
  description:
    "Comprehensive guides for fullstack development with Next.js, Node.js, PostgreSQL, and TypeScript.",
  keywords: [
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "React",
    "Fullstack",
    "Documentation",
  ],
  authors: [{ name: "Fullstack Docs Team" }],
  creator: "Fullstack Docs",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fullstack-docs.com",
    title: "Fullstack Docs - Learn Modern Web Development",
    description: "Comprehensive guides for fullstack development",
    siteName: "Fullstack Docs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fullstack Docs",
    description: "Comprehensive guides for fullstack development",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = getNavigationItems();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background antialiased",
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar items={items} />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Stack Docs. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
