import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductActions } from "@/components/store/product-actions";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
      variants: {
        include: {
          color: true,
          size: true,
        },
      },
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];

  // Colores y talles únicos disponibles
  const colors = [
    ...new Map(product.variants.map((v) => [v.colorId, v.color])).values(),
  ];
  const sizes = [
    ...new Map(product.variants.map((v) => [v.sizeId, v.size])).values(),
  ].sort((a, b) => a.order - b.order);

  const avgRating = product.reviews.length
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-neutral-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className="text-sm text-muted-foreground">
              {product.category.name}
            </span>
            <h1 className="text-3xl font-bold tracking-tight mt-1">
              {product.name}
            </h1>
            {avgRating && (
              <p className="text-sm text-muted-foreground mt-1">
                ⭐ {avgRating.toFixed(1)} ({product.reviews.length} reseñas)
              </p>
            )}
          </div>

          <p className="text-2xl font-semibold">
            ${Number(product.basePrice).toLocaleString("es-AR")}
          </p>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>

          <ProductActions
            product={{
              id: product.id,
              name: product.name,
              basePrice: Number(product.basePrice),
              image: primaryImage?.url ?? "",
            }}
            colors={colors}
            sizes={sizes}
            variants={product.variants.map((v) => ({
              id: v.id,
              colorId: v.colorId,
              sizeId: v.sizeId,
              stock: v.stock,
              price: v.price ? Number(v.price) : null,
            }))}
          />
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">Reseñas</h2>
          <div className="flex flex-col gap-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="border border-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">
                    {review.user.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {"⭐".repeat(review.rating)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
