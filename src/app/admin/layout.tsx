"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, LayoutDashboard, Settings, LogOut, Layers } from "lucide-react";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      <aside className="w-64 border-r bg-background hidden md:flex flex-col">
        <div className="p-6 border-b">
          <Link href="/admin">
            <h2 className="font-bold text-lg hover:opacity-80 transition-opacity">
              ✏️ Admin
            </h2>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            href="/admin/documents"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
          >
            <FileText size={18} /> Hujjatlar
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
          >
            <Layers size={18} /> Kategoriyalar
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
          >
            <Settings size={18} /> Sozlamalar
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2"
            size="sm"
          >
            <LogOut size={18} /> Chiqish
          </Button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <div className="p-8 flex-1">{children}</div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
