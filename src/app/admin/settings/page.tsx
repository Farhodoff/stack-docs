import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Configure your documentation platform settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Information</CardTitle>
            <CardDescription>Current system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Framework</span>
              <Badge variant="secondary">Next.js 15</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Content Format</span>
              <Badge variant="secondary">MDX v3</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">UI Components</span>
              <Badge variant="secondary">shadcn/ui</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Styling</span>
              <Badge variant="secondary">Tailwind CSS</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Authentication</span>
              <Badge variant="secondary">Supabase Auth</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>File system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Storage Type</span>
              <Badge variant="secondary">File System</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Docs Directory</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">/docs</code>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Format</span>
              <Badge variant="secondary">.mdx files</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Enabled capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                Server-Side Rendering
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                Automatic Revalidation
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                Full-Text Search
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                Responsive Design
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                Dark/Light Mode
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                Protected Admin Routes
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Authentication & authorization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Auth Provider</span>
              <Badge variant="secondary">Supabase</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Session Management</span>
              <Badge variant="secondary">Cookies (SSR)</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Protected Routes</span>
              <Badge variant="secondary">/admin/*</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
