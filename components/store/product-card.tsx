import Link from "next/link";
import Image from "next/image";
import { ProductImage } from "@/lib/generated/prisma/client";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: any;
    images: ProductImage[];
    category: { name: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      {/* Imagen */}
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

      {/* Info */}
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
  );
}
