"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ProductSearch({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/admin/products?${params.toString()}`);
    },
    [searchParams, router],
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("search", search);
  }

  function clearFilters() {
    setSearch("");
    router.push("/admin/products");
  }

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Búsqueda */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            className="text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o slug..."
            style={{ paddingLeft: "36px" }}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Buscar
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-neutral-100 transition flex items-center gap-1"
          >
            <X size={14} />
            Limpiar
          </button>
        )}
      </form>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {/* Por categoría */}
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateParams("category", e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm outline-none"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Por estado */}
        <select
          value={searchParams.get("status") ?? ""}
          onChange={(e) => updateParams("status", e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>
    </div>
  );
}
