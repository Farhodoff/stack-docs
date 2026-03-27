"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { bulkUploadAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Download, FileJson, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function BulkUploadPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    created?: number;
    failed?: Array<{ index: number; title: string; error: string }>;
  } | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      toast.error("Faqat JSON fayllar yuklash mumkin");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const text = await file.text();
      const docs = JSON.parse(text);

      if (!Array.isArray(docs)) {
        toast.error("JSON fayl hujjatlar massivini o'z ichishi kerak");
        return;
      }

      const response = await bulkUploadAction(docs);

      if (response.success) {
        toast.success(response.message);
        setResult({
          created: response.created,
          failed: response.failed,
        });
        router.refresh();
      } else {
        toast.error(response.message || "Yuklashda xatolik");
      }
    } catch (error) {
      console.error(error);
      toast.error("JSON faylni o'qishda xatolik yuz berdi");
    } finally {
      setUploading(false);
    }
  }, [router]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const downloadTemplate = () => {
    const template = [
      {
        title: "Namuna sarlavha",
        description: "Namuna tavsif",
        category: "kategoriya",
        order: 1,
        tags: ["tag1", "tag2"],
        content: "# Markdown content\nBu yerda hujjat mazmuni..."
      }
    ];
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-upload-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Ko'plab hujjatlarni yuklash</h2>
        <p className="text-muted-foreground">
          JSON fayl orqali bir nechta hujjatlarni yuklang
        </p>
      </div>

      {/* Template Download */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileJson className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Shablon yuklab olish</h3>
                <p className="text-sm text-muted-foreground">
                  JSON formatini ko'rish uchun shablonni yuklab oling
                </p>
              </div>
            </div>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Shablonni yuklab olish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".json"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            
            <div className="space-y-4">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  {uploading ? "Yuklanmoqda..." : "Faylni bu yerga tashlang"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  yoki bosing va JSON faylni tanlang
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Faqat JSON fayllar qabul qilinadi
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {result.created !== undefined && result.created > 0 && (
            <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Muvaffaqiyatli!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {result.created} ta hujjat yaratildi
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {result.failed && result.failed.length > 0 && (
            <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">
                      Xatolar
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {result.failed.length} ta hujjat yuklanmadi
                    </p>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-auto">
                  {result.failed.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm p-3 bg-background rounded-md border"
                    >
                      <div className="font-medium">{item.title}</div>
                      <div className="text-destructive text-xs mt-1">
                        {item.error}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Link href="/admin/documents">
              <Button>Hujjatlarni ko'rish</Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
              }}
            >
              Yangi yuklash
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
