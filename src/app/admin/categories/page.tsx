"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
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

      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-8 z-50">
          <div className="bg-background border rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">
                {editingCategory ? "Kategoriyani Tahrirlash" : "Yangi Kategoriya"}
              </h2>
              <button
                type="button"
                onClick={() => setShowDialog(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Dialogni yopish"
                title="Dialogni yopish"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <CategoryForm
                mode={editingCategory ? "edit" : "create"}
                initialData={editingCategory || undefined}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
