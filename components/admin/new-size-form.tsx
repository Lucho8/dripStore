"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSize } from "@/lib/actions/colors-sizes.actions";

export function NewSizeForm({ nextOrder }: { nextOrder: number }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const result = await createSize(name.toUpperCase(), nextOrder);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("¡Talle creado!");
    setName("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">Agregar talle</h3>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: XS, 38, Único..."
          className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "..." : "Agregar"}
        </button>
      </div>
    </form>
  );
}
