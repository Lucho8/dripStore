import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/product-card";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { category } = await searchParams;

  const products = await db.product.findMany({
    where: {
      isActive: true,
      ...(category && {
        category: { slug: category },
      }),
    },
    include: {
      images: { where: { isPrimary: true } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : "Todos los productos"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {products.length} productos encontrados
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map((f) => (
          <a
            key={f.slug}
            href={f.slug ? `/products?category=${f.slug}` : "/products"}
            className={`px-4 py-1.5 rounded-full text-sm border transition
              ${
                category === f.slug || (!category && !f.slug)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
          >
            {f.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No hay productos en esta categoría todavía.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

const filters = [
  { name: "Todos", slug: "" },
  { name: "Remeras", slug: "remeras" },
  { name: "Pantalones", slug: "pantalones" },
  { name: "Buzos", slug: "buzos" },
  { name: "Accesorios", slug: "accesorios" },
];
