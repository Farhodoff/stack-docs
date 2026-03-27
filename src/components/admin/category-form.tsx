"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  createCategoryAction,
  updateCategoryAction,
  CategoryFormData,
} from "@/app/admin/actions";

const categorySchema = z.object({
  id: z.string().min(1, "ID kerak").regex(/^[a-z0-9-]+$/, "Faqat kichik harflar, raqamlar va defis"),
  name: z.string().min(1, "Nomi kerak").max(50),
  description: z.string().min(1, "Tavsifi kerak").max(200),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "To'g'ri rang formati: #RRGGBB"),
  order: z.number().int().nonnegative(),
  icon: z.string().max(2).optional(),
});

interface CategoryFormProps {
  mode: "create" | "edit";
  initialData?: CategoryFormData & { createdAt?: string; updatedAt?: string };
  onSuccess?: () => void;
}

export function CategoryForm({ mode, initialData, onSuccess }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData ? {
      ...initialData,
      order: (initialData.order ?? 0) as number,
    } : {
      id: "",
      name: "",
      description: "",
      color: "#3b82f6",
      order: 0,
      icon: "",
    },
  });

  const color = watch("color");

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    try {
      setIsLoading(true);

      if (mode === "create") {
        const result = await createCategoryAction(data);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Kategoriya muvaffaqiyatli yaratildi");
      } else if (initialData) {
        const result = await updateCategoryAction(initialData.id, data);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Kategoriya muvaffaqiyatli yangilandi");
      }

      onSuccess?.();
    } catch (error) {
      toast.error("Xatolik yuz berdi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="id">ID (slug)*</Label>
        <Input
          id="id"
          placeholder="react, nodejs, ..."
          disabled={mode === "edit" || isLoading}
          {...register("id")}
          className={errors.id ? "border-destructive" : ""}
        />
        {errors.id && (
          <p className="text-sm text-destructive">{errors.id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nomi*</Label>
        <Input
          id="name"
          placeholder="React, Node.js, ..."
          disabled={isLoading}
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Tavsifi*</Label>
        <Textarea
          id="description"
          placeholder="Kategoriya haqida qisqa tavsif..."
          disabled={isLoading}
          className={`resize-none ${errors.description ? "border-destructive" : ""}`}
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Rang*</Label>
          <div className="flex gap-2 items-center">
            <input
              id="color"
              type="color"
              disabled={isLoading}
              {...register("color")}
              className="w-16 h-10 rounded cursor-pointer"
            />
            <Input
              type="text"
              value={color}
              disabled
              className="flex-1 bg-muted"
            />
          </div>
          {errors.color && (
            <p className="text-sm text-destructive">{errors.color.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon (emoji)*</Label>
          <Input
            id="icon"
            placeholder="⚛️, 🟢, ..."
            maxLength={2}
            disabled={isLoading}
            {...register("icon")}
            className={errors.icon ? "border-destructive" : ""}
          />
          {errors.icon && (
            <p className="text-sm text-destructive">{errors.icon.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Tartib*</Label>
        <Input
          id="order"
          type="number"
          min="0"
          disabled={isLoading}
          {...register("order", { valueAsNumber: true })}
          className={errors.order ? "border-destructive" : ""}
        />
        {errors.order && (
          <p className="text-sm text-destructive">{errors.order.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saqlanmoqda..." : mode === "create" ? "Yaratish" : "Yangilash"}
        </Button>
      </div>
    </form>
  );
}
