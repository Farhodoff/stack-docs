"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createDocAction, updateDocAction, getAllCategoriesAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-md border border-input bg-muted flex items-center justify-center text-muted-foreground">
      Loading Editor...
    </div>
  ),
});

interface DocFormProps {
  mode?: "create" | "edit";
  initialData?: {
    frontmatter: {
      title: string;
      description: string;
      category: string;
      order: number;
      tags: string[];
    };
    content: string;
    slug?: string;
  };
}

const docSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  order: z.coerce.number().int().nonnegative(),
  tags: z.string(),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]).default("draft"),
});

type FormData = z.infer<typeof docSchema>;

export function DocForm({ mode = "create", initialData }: DocFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(docSchema),
    defaultValues:
      mode === "edit" && initialData
        ? {
            title: initialData.frontmatter.title,
            description: initialData.frontmatter.description,
            category: initialData.frontmatter.category,
            order: initialData.frontmatter.order,
            tags: initialData.frontmatter.tags.join(", "),
            content: initialData.content,
            status: (initialData.frontmatter as any).status || "draft",
          }
        : {
            order: 1,
            status: "draft",
          },
  });

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getAllCategoriesAction();
        setCategories(cats || []);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Kategoriyalarni yuklashda xatolik");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const result =
        mode === "create"
          ? await createDocAction({
              ...data,
              tags: data.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          : await updateDocAction(initialData!.slug!, {
              ...data,
              tags: data.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            });

      if (result.error) {
        // Show detailed error message
        const errorMsg = result.details
          ? `${result.error}: ${JSON.stringify(result.details)}`
          : result.error;
        toast.error(errorMsg);
        console.error("Form error:", errorMsg);
      } else {
        toast.success(
          mode === "create" ? "Hujjat yaratildi! ✅" : "Hujjat yangilandi! ✅",
        );
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Xatoli";
      toast.error(`Xatolik: ${errorMessage}`);
      console.error("Exception:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Frontmatter Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title *
          </label>
          <input
            id="title"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category *
          </label>
          <select
            id="category"
            disabled={isLoadingCategories}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("category")}
          >
            <option value="">Kategoriya tanlang...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description *
          </label>
          <input
            id="description"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="order" className="text-sm font-medium">
            Order
          </label>
          <input
            id="order"
            type="number"
            min="0"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("order")}
          />
          {errors.order && (
            <p className="text-sm text-destructive">{errors.order.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="tags" className="text-sm font-medium">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            placeholder="react, nextjs, tutorial"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("tags")}
          />
          {errors.tags && (
            <p className="text-sm text-destructive">{errors.tags.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Holat
          </label>
          <select
            id="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("status")}
          >
            <option value="draft">Qoralama (Draft)</option>
            <option value="published">Chop etilgan (Published)</option>
          </select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* MDX Editor */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Content *</label>
        <div className="prose-invert">
          <SimpleMDE
            value={watch("content")}
            onChange={(value) => setValue("content", value || "")}
            options={{
              spellChecker: false,
              maxHeight: "400px",
              status: false,
            }}
          />
        </div>
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Document"
              : "Update Document"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
