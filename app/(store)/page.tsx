import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-32 flex flex-col items-start gap-6">
          <span className="text-sm font-medium tracking-widest uppercase text-neutral-400">
            Nueva colección 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
            Vestite <br />
            diferente.
          </h1>
          <p className="text-neutral-400 text-lg max-w-md">
            Streetwear y ropa urbana para los que se animan a destacar. Calidad
            real, estilo propio.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/products"
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-neutral-200 transition"
            >
              Ver productos
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/products?category=remeras"
              className="text-sm text-neutral-400 hover:text-white transition underline underline-offset-4"
            >
              Ver remeras
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold mb-8">Explorá por categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-square rounded-2xl bg-neutral-100 overflow-hidden flex items-end p-4 hover:bg-neutral-200 transition"
            >
              <span className="text-2xl mb-1">{cat.emoji}</span>
              <span className="font-semibold text-sm ml-2">{cat.name}</span>
              <ArrowRight
                size={16}
                className="ml-auto opacity-0 group-hover:opacity-100 transition"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Destacados</h2>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-3/4 rounded-2xl bg-neutral-200 animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Envío gratis</h2>
            <p className="text-neutral-400">En compras mayores a $50.000</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Devolución fácil</h2>
            <p className="text-neutral-400">30 días para cambios sin costo</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Pago seguro</h2>
            <p className="text-neutral-400">Stripe protege cada transacción</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  { name: "Remeras", slug: "remeras", emoji: "👕" },
  { name: "Pantalones", slug: "pantalones", emoji: "👖" },
  { name: "Buzos", slug: "buzos", emoji: "🧥" },
  { name: "Accesorios", slug: "accesorios", emoji: "🧢" },
];
