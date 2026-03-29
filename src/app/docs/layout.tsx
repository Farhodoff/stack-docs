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
      {/* Left Sidebar - 140px fixed */}
      <aside className="hidden lg:flex w-35 flex-shrink-0 border-r border-border/50 bg-background">
        <div className="sticky top-12 h-[calc(100vh-3rem)] w-full overflow-y-auto p-4">
          <CleanSidebar items={items} />
        </div>
      </aside>

      {/* Main Content - Flexible center, max 680px */}
      <main className="flex-1 min-w-0 max-w-none">
        <div className="mx-auto max-w-[680px] px-6 py-8">
          {children}
        </div>
      </main>

      {/* Right Context Panel - 140px fixed */}
      <aside className="hidden xl:flex w-35 flex-shrink-0">
        <div className="sticky top-12 h-[calc(100vh-3rem)] w-full p-4">
          <RightContextPanel repoUrl="https://github.com/Farhodoff/stack-docs" />
        </div>
      </aside>
    </div>
  )
}
