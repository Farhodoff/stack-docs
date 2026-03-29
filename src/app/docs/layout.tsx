import { getNavigationItems } from '@/lib/readDocsMetadata'
import { CleanSidebar } from '@/components/layout/clean-sidebar'
import { RightContextPanel } from '@/components/layout/right-context-panel'

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const items = getNavigationItems()

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - 256px fixed */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/20 transition-colors">
          <CleanSidebar items={items} />
        </div>
      </aside>

      {/* Main Content - Flexible center, max 680px */}
      <main className="flex-1 min-w-0 max-w-none">
        <div className="mx-auto max-w-[680px] px-6 py-8">
          {children}
        </div>
      </main>

      {/* Right Context Panel - 256px fixed */}
      <aside className="hidden xl:flex w-64 flex-shrink-0 border-l border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="sticky top-16 h-[calc(100vh-4rem)] w-full px-4 py-6">
          <RightContextPanel repoUrl="https://github.com/Farhodoff/stack-docs" />
        </div>
      </aside>
    </div>
  )
}
