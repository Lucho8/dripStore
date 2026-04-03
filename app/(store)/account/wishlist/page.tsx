import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/product-card";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const wishlistItems = await db.wishlistItem.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          variants: true,
          category: true,
        },
      },
    },
    // ELIMINADO EL orderBy QUE CAUSABA EL ERROR
  });

  const products = wishlistItems.map((item) => item.product);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Favoritos</h1>
        <p className="text-muted-foreground mt-1">
          {products.length}{" "}
          {products.length === 1 ? "producto guardado" : "productos guardados"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
          Aún no tienes productos en tu lista de deseos.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product as any}
              isFavorited={true} // ¡Aquí simplemente le decimos que es true!
            />
          ))}
        </div>
      )}
    </div>
  );
}
