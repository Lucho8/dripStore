import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/product-card";
import Link from "next/link"; // Usaremos Link en lugar de <a> para navegar sin recargar toda la página
import { auth } from "@/auth";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { category, q } = await searchParams;
  const session = await auth();

  const dbCategories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const whereCondition: any = {
    isActive: true,
  };

  if (category) {
    whereCondition.category = { slug: category };
  }

  if (q) {
    whereCondition.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const products = await db.product.findMany({
    where: whereCondition,
    include: {
      images: { where: { isPrimary: true } },
      category: true,
      wishlist: session?.user?.id
        ? {
            where: {
              userId: session.user.id,
            },
          }
        : false,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {q
            ? `Resultados para "${q}"`
            : category
              ? category.charAt(0).toUpperCase() + category.slice(1)
              : "Todos los productos"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {products.length} productos encontrados
        </p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link
          href="/products"
          className={`px-4 py-1.5 rounded-full text-sm border transition
            ${
              !category && !q
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
        >
          Todos
        </Link>

        {dbCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-1.5 rounded-full text-sm border transition
              ${
                category === cat.slug
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {q
            ? `No se encontraron productos que coincidan con "${q}".`
            : "No hay productos en esta categoría todavía."}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isFavorited = session?.user?.id
              ? product.wishlist.length > 0
              : false;
            return (
              <ProductCard
                key={product.id}
                product={product as any}
                isFavorited={isFavorited}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}