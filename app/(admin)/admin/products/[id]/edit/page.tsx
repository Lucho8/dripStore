import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductEditForm } from "@/components/admin/product-edit-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const [product, categories, colors, sizes] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        images: { where: { isPrimary: true } },
        variants: {
          include: { color: true, size: true },
        },
      },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    db.color.findMany(),
    db.size.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div style={{ padding: "32px" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Editar producto</h1>
        <p className="text-muted-foreground text-sm mt-1">{product.name}</p>
      </div>
      <ProductEditForm
        product={{
          ...product,
          basePrice:
            product.basePrice === null ? null : Number(product.basePrice),
          variants: product.variants.map((v) => ({
            ...v,
            price: v.price === null ? null : Number(v.price),
          })),
        }}
        categories={categories}
        colors={colors}
        sizes={sizes}
      />
    </div>
  );
}
