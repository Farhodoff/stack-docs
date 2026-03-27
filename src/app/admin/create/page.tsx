import { DocForm } from '@/components/admin/doc-form'

export default function CreateDocPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">➕ Yangi Hujjat Yaratish</h2>
        <p className="text-muted-foreground">
          Saytingizga yangi hujjat qo'shish
        </p>
      </div>

      <DocForm mode="create" />
    </div>
  )
}
