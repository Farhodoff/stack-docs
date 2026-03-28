"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Layers,
  Menu 
} from "lucide-react";
import { Toaster } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const DesktopNavLinks = () => (
    <>
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
    </>
  );

  const MobileNavLinks = () => (
    <>
      <SheetClose asChild>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium w-full"
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link
          href="/admin/documents"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium w-full"
        >
          <FileText size={18} /> Hujjatlar
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link
          href="/admin/categories"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium w-full"
        >
          <Layers size={18} /> Kategoriyalar
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium w-full"
        >
          <Settings size={18} /> Sozlamalar
        </Link>
      </SheetClose>
    </>
  );

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r bg-background hidden md:flex flex-col">
        <div className="p-6 border-b">
          <Link href="/admin">
            <h2 className="font-bold text-lg hover:opacity-80 transition-opacity">
              ✏️ Admin
            </h2>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <DesktopNavLinks />
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

      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b h-16 flex items-center px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="mb-6">
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <h2 className="font-bold text-lg hover:opacity-80 transition-opacity">
                  ✏️ Admin
                </h2>
              </Link>
            </div>
            <nav className="flex flex-col space-y-2">
              <MobileNavLinks />
            </nav>
            <div className="mt-8 pt-4 border-t">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                variant="outline"
                className="w-full justify-start gap-2"
                size="sm"
              >
                <LogOut size={18} /> Chiqish
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-center">
          <h1 className="font-bold md:hidden">✏️ Admin</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden md:pt-0 pt-16">
        <div className="p-4 md:p-8 flex-1">{children}</div>
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}
