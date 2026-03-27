import { DocForm } from '@/components/admin/doc-form'

export default function CreateDocPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Create New Documentation</h2>
        <p className="text-muted-foreground">
          Add a new documentation page to your site
        </p>
      </div>
      
      <DocForm mode="create" />
    </div>
  )
}
