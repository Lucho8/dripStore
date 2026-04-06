"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:flex items-center relative mr-2"
    >
      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-48 px-4 py-1.5 pl-10 bg-neutral-100 rounded-full text-sm border-transparent focus:bg-white focus:border-border focus:ring-0 focus:outline-none transition-all"
      />
      <Search
        size={16}
        className="absolute left-3.5 text-muted-foreground"
      />
    </form>
  );
}
