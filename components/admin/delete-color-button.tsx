"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteColor } from "@/lib/actions/colors-sizes.actions";
import { Trash2 } from "lucide-react";

export function DeleteColorButton({
  colorId,
  colorName,
}: {
  colorId: string;
  colorName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Eliminar el color "${colorName}"?`)) return;

    setLoading(true);
    const result = await deleteColor(colorId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Color eliminado");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-muted-foreground hover:text-destructive transition disabled:opacity-50"
    >
      <Trash2 size={15} />
    </button>
  );
}
