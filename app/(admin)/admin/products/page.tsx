import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { ProductSearch } from "@/components/admin/product-search";

interface AdminProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
  }>;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const { search, category, status } = await searchParams;

  const products = await db.product.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category: { slug: category } }),
      ...(status === "active" && { isActive: true }),
      ...(status === "inactive" && { isActive: false }),
    },
    include: {
      category: true,
      images: { where: { isPrimary: true } },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ padding: "32px" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {products.length} productos encontrados
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      {/* Búsqueda y filtros */}
      <ProductSearch categories={categories} />

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden mt-4">
        {products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No se encontraron productos
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th
                  className="text-sm font-medium text-muted-foreground"
                  style={{ padding: "12px 16px", textAlign: "left" }}
                >
                  Producto
                </th>
                <th
                  className="text-sm font-medium text-muted-foreground"
                  style={{ padding: "12px 16px", textAlign: "left" }}
                >
                  Categoría
                </th>
                <th
                  className="text-sm font-medium text-muted-foreground"
                  style={{ padding: "12px 16px", textAlign: "left" }}
                >
                  Precio
                </th>
                <th
                  className="text-sm font-medium text-muted-foreground"
                  style={{ padding: "12px 16px", textAlign: "left" }}
                >
                  Variantes
                </th>
                <th
                  className="text-sm font-medium text-muted-foreground"
                  style={{ padding: "12px 16px", textAlign: "left" }}
                >
                  Estado
                </th>
                <th
                  className="text-sm font-medium text-muted-foreground"
                  style={{ padding: "12px 16px", textAlign: "left" }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-neutral-50 transition"
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-lg bg-neutral-100 overflow-hidden shrink-0"
                        style={{ width: "40px", height: "48px" }}
                      >
                        {product.images[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className="text-sm">{product.category.name}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className="text-sm font-medium">
                      ${Number(product.basePrice).toLocaleString("es-AR")}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className="text-sm text-muted-foreground">
                      {product.variants.length} variantes
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        backgroundColor: product.isActive
                          ? "#dcfce7"
                          : "#f5f5f5",
                        color: product.isActive ? "#15803d" : "#737373",
                      }}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 transition text-muted-foreground hover:text-foreground inline-flex"
                    >
                      <Pencil size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
