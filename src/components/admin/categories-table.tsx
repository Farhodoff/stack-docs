"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { CategoryFormData } from "@/app/admin/actions";

interface Category extends CategoryFormData {
  createdAt: string;
  updatedAt: string;
}

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
}: CategoriesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted">
              <th className="px-4 py-2 text-left font-medium">Icon</th>
              <th className="px-4 py-2 text-left font-medium">Nomi</th>
              <th className="px-4 py-2 text-left font-medium">Tavsifi</th>
              <th className="px-4 py-2 text-left font-medium">Rang</th>
              <th className="px-4 py-2 text-left font-medium">Tartib</th>
              <th className="px-4 py-2 text-right font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                  Kategoriyalar topilmadi
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 text-lg">{category.icon || "-"}</td>
                  <td className="px-4 py-3 font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                    {category.description}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: category.color }}
                      title={category.color}
                    />
                  </td>
                  <td className="px-4 py-3">{category.order + 1}</td>
                  <td className="px-4 py-3 text-right flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(category.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Kategoriyani o'chirish</AlertDialogTitle>
          <AlertDialogDescription>
            Siz ushbu kategoriyani o'chirib tashlashga ishonchli ekanmisiz?
            Bu amal qaytarilmaydi.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Bekor</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              O'chirish
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
