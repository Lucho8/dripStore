import Link from "next/link";
import Image from "next/image";
import { ProductImage } from "@/lib/generated/prisma/client";
import { WishlistButton } from "@/components/store/wishlist-button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: any;
    images: ProductImage[];
    category: { name: string };
  };

  isFavorited?: boolean;
}

export function ProductCard({
  product,
  isFavorited = false,
}: ProductCardProps) {
  const image = product.images[0];

  return (
    <div className="relative group flex flex-col gap-3">
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:opacity-100">
        <WishlistButton
          productId={product.id}
          initialIsFavorited={isFavorited}
        />
      </div>

      <Link href={`/products/${product.slug}`} className="flex flex-col gap-3">
        <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-neutral-100">
          {image ? (
            <Image
              src={image.url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-sm">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            {product.category.name}
          </span>
          <h3 className="text-sm font-medium leading-tight group-hover:underline">
            {product.name}
          </h3>
          <span className="text-sm font-semibold">
            ${Number(product.basePrice).toLocaleString("es-AR")}
          </span>
        </div>
      </Link>
    </div>
  );
}
