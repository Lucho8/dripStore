import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductActions } from "@/components/store/product-actions";
import { StarRating } from "@/components/store/star-rating";
import { ReviewForm } from "@/components/store/review-form";
import { auth } from "@/auth";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const session = await auth();

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

  const colors = [
    ...new Map(product.variants.map((v) => [v.colorId, v.color])).values(),
  ];
  const sizes = [
    ...new Map(product.variants.map((v) => [v.sizeId, v.size])).values(),
  ].sort((a, b) => a.order - b.order);

  const avgRating = product.reviews.length
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length
    : 0;

  const hasUserReviewed = session?.user?.id
    ? product.reviews.some((r) => r.userId === session.user.id)
    : false;

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

            <div className="mt-2">
              <StarRating
                rating={avgRating}
                totalReviews={product.reviews.length}
              />
            </div>
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

      <div className="mt-20 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold mb-8">Reseñas de clientes</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {product.reviews.length === 0 ? (
              <p className="text-muted-foreground italic">
                Aún no hay reseñas para este producto. ¡Sé el primero en opinar!
              </p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-border rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm">
                      {review.user.name || "Usuario Anónimo"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="mb-3">
                    <StarRating rating={review.rating} size={14} />
                  </div>

                  {review.comment && (
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          <div>
            {session ? (
              hasUserReviewed ? (
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200">
                  <p className="text-sm font-medium">
                    Ya dejaste tu reseña para este producto. ¡Gracias por tu
                    opinión!
                  </p>
                </div>
              ) : (
                <ReviewForm productId={product.id} />
              )
            ) : (
              <div className="bg-neutral-50 p-6 rounded-xl border border-border text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Inicia sesión para dejar tu opinión sobre este producto.
                </p>
                <a
                  href="/login"
                  className="inline-block px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition"
                >
                  Iniciar sesión
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
