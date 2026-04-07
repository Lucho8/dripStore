"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleCategoryStatus } from "@/lib/actions/category.actions";

interface CategoryActionsProps {
  category: {
    id: string;
    name: string;
    isActive: boolean;
    productCount: number;
  };
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (category.isActive && category.productCount > 0) {
      toast.error(
        `No podés desactivar una categoría con ${category.productCount} productos activos`,
      );
      return;
    }

    setLoading(true);
    const result = await toggleCategoryStatus(category.id, !category.isActive);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(
      category.isActive ? "Categoría desactivada" : "Categoría activada",
    );
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
      <button
        onClick={handleToggle}
        disabled={loading}
        className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-neutral-100 transition disabled:opacity-50"
      >
        {loading ? "..." : category.isActive ? "Desactivar" : "Activar"}
      </button>
    </div>
  );
}
