import { getAllDocsMetadata } from "@/lib/mdx/parser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Layers, Clock, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const docs = getAllDocsMetadata();

  const totalDocs = docs.length;
  const categories = new Set(docs.map((doc) => doc.frontmatter?.category)).size;

  // Just grabbing a few docs to display as "Recent" or "Top"
  const recentDocs = docs.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📊 Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Dokumentatsiyangizning maqolalari va statistikasi
          </p>
        </div>
        <Link href="/admin/create">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Yangi Hujjat
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jami Hujjatlar
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriyalar</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistema Holati</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Faol</div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Hujjatlarning Ko'rinishi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Sarlavha
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Kategoriya
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Yo'li
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {recentDocs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Hujjatlar topilmadi.
                    </td>
                  </tr>
                ) : (
                  recentDocs.map((doc) => (
                    <tr
                      key={doc.slug}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle font-medium">
                        {doc.frontmatter?.title || "Nomom"}
                      </td>
                      <td className="p-4 align-middle">
                        {doc.frontmatter?.category || "Yo'q"}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {doc.slug}.mdx
                      </td>
                      <td className="p-4 align-middle text-right flex justify-end gap-2">
                        <Link href={`/admin/edit/${doc.slug}`}>
                          <Button variant="outline" size="sm">
                            Tahrirlash
                          </Button>
                        </Link>
                        <Link href={`/docs/${doc.slug}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink size={14} /> Ko'rish
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/admin/documents">
              <Button variant="link">Barcha Hujjatlarni Ko'rish</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
