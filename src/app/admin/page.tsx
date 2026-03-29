import { getAllDocsMetadata } from "@/lib/mdx/parser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Layers, Clock, Plus, ExternalLink, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getAllCategoriesAction, CategoryFormData } from "@/app/admin/actions";

// Type for category stats with count
interface CategoryStat extends CategoryFormData {
  count: number;
}

export default async function AdminDashboardPage() {
  const docs = getAllDocsMetadata();
  const allCategories = await getAllCategoriesAction();

  const totalDocs = docs.length;
  const categories = new Set(docs.map((doc) => doc.frontmatter?.category)).size;

  // Calculate docs per category
  const categoryStats: CategoryStat[] = allCategories.map((cat: CategoryFormData) => {
    const count = docs.filter((doc) => doc.frontmatter?.category === cat.id).length;
    return {
      ...cat,
      count,
    };
  }).filter((cat: CategoryStat) => cat.count > 0).sort((a: CategoryStat, b: CategoryStat) => b.count - a.count);

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Kategoriyalar bo'yicha statistika
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryStats.length === 0 ? (
              <p className="text-muted-foreground col-span-full">
                Statistika topilmadi
              </p>
            ) : (
              categoryStats.map((cat: CategoryStat) => {
                // Dynamic category colors - inline styles necessary for user-defined colors
                // eslint-disable-next-line react/forbid-dom-props
                // webhint:disable no-inline-styles
                return (
                <div
                  key={cat.id}
                  className="p-4 rounded-lg border transition-colors hover:bg-muted"
                  style={{ borderLeftColor: cat.color, borderLeftWidth: "4px" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <Link
                        href={`/admin/documents?category=${cat.id}`}
                        className="font-semibold hover:underline"
                      >
                        {cat.name}
                      </Link>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-white text-sm font-bold"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                  <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        backgroundColor: cat.color,
                        width: `${(cat.count / totalDocs) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

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
