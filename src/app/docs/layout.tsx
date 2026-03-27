import { getNavigationItems } from '@/lib/readDocsMetadata'
import { DocsSidebar } from '@/components/layout/docs-sidebar'

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const items = getNavigationItems()

  return (
    <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4 md:px-8">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r py-6 pr-4 md:sticky md:block overflow-y-auto">
        <DocsSidebar items={items} />
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-8 w-full min-w-0">
        <div className="mx-auto w-full max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  )
}
