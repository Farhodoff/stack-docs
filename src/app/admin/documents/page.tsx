import { getAllDocsAction } from '@/app/admin/actions'
import DocumentsPage from './documents-page-client'

export default async function AdminDocumentsPage() {
  const docs = await getAllDocsAction()
  
  return <DocumentsPage docs={docs} />
}
