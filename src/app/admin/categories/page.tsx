"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAllCategoriesAction,
  deleteCategoryAction,
  CategoryFormData,
} from "@/app/admin/actions";
import { CategoriesTable } from "@/components/admin/categories-table";
import { CategoryForm } from "@/components/admin/category-form";
import { toast } from "sonner";

interface Category extends CategoryFormData {
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCategoriesAction();
      setCategories(data || []);
    } catch (error) {
      toast.error("Kategoriyalarni yuklashda xatolik");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const result = await deleteCategoryAction(id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Kategoriya muvaffaqiyatli o'chirildi");
      await loadCategories();
    } catch (error) {
      toast.error("Kategoriyani o'chirishda xatolik");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccess = async () => {
    setShowDialog(false);
    setEditingCategory(null);
    await loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📚 Kategoriyalar</h1>
          <p className="text-muted-foreground mt-2">
            Hujjatlar kategoriyalarini boshqaring
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setShowDialog(true);
          }}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Yangi Kategoriya
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Kategoriyalar yuklanimoqda...</p>
        </div>
      ) : (
        <CategoriesTable
          categories={categories}
          onEdit={(category) => {
            setEditingCategory(category);
            setShowDialog(true);
          }}
          onDelete={handleDelete}
          isLoading={isDeleting}
        />
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Kategoriyani Tahrirlash" : "Yangi Kategoriya"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            mode={editingCategory ? "edit" : "create"}
            initialData={editingCategory || undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
