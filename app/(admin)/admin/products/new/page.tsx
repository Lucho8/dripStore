import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/lib/db";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const colors = await db.color.findMany();
  const sizes = await db.size.findMany({ orderBy: { order: "asc" } });

  return (
    <div style={{ padding: "32px" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Nuevo producto</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Completá los datos para crear un nuevo producto
        </p>
      </div>
      <ProductForm categories={categories} colors={colors} sizes={sizes} />
    </div>
  );
}
