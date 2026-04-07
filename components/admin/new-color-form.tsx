"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createColor } from "@/lib/actions/colors-sizes.actions";

export function NewColorForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [hexCode, setHexCode] = useState("#000000");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const result = await createColor(name, hexCode);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("¡Color creado!");
    setName("");
    setHexCode("#000000");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">Agregar color</h3>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Verde Oliva"
          className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
        />
        <input
          type="color"
          value={hexCode}
          onChange={(e) => setHexCode(e.target.value)}
          className="w-10 h-10 rounded-lg border border-input cursor-pointer"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Creando..." : "Agregar color"}
      </button>
    </form>
  );
}
