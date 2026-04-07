"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Si ya había una búsqueda en la URL, la cargamos como estado inicial
  const defaultQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(defaultQuery);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Si el usuario borra todo y da Enter, lo mandamos a la tienda general
    if (!query.trim()) {
      router.push("/products");
      return;
    }

    // Navegamos a la página de productos pasando la búsqueda como parámetro 'q'
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "300px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        style={{
          width: "100%",
          padding: "8px 16px 8px 36px",
          borderRadius: "9999px",
          border: "1px solid #e5e5e5",
          fontSize: "14px",
          outline: "none",
          backgroundColor: "#f5f5f5",
        }}
        onFocus={(e) => (e.target.style.backgroundColor = "#ffffff")}
        onBlur={(e) => {
          if (!query) e.target.style.backgroundColor = "#f5f5f5";
        }}
      />
      <button
        type="submit"
        style={{
          position: "absolute",
          left: "10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: "#737373",
        }}
      >
        <Search size={16} />
      </button>
    </form>
  );
}
