import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ClientLayout } from "@/components/layout/client-layout";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { getNavigationItems } from "@/lib/readDocsMetadata";
import { buildSearchIndex } from "@/lib/buildSearchIndex";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "📚 Stack Docs - Fullstack Dasturchilik O'rganish",
  description:
    "Next.js, Node.js, PostgreSQL va TypeScript bilan fullstack development uchun to'liq qo'llanmalar.",
  keywords: [
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "React",
    "Fullstack",
    "Dokumentatsiya",
  ],
  authors: [{ name: "Stack Docs Jamoasi" }],
  creator: "Stack Docs",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://stack-docs.com",
    title: "📚 Stack Docs - Fullstack Dasturchilik O'rganish",
    description: "Fullstack development uchun to'liq qo'llanmalar",
    siteName: "Stack Docs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack Docs",
    description: "Fullstack development uchun to'liq qo'llanmalar",
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
  const navigationItems = getNavigationItems();
  const searchIndex = buildSearchIndex();

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
          <ClientLayout
            navigationItems={navigationItems}
            searchIndex={searchIndex}
          >
            {children}
          </ClientLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
