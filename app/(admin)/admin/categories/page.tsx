import { db } from "@/lib/db";
import { CategoryActions } from "@/components/admin/category-actions";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ padding: "32px" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {categories.length} categorías en total
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl border border-border"
            style={{ padding: "20px" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  /{category.slug}
                </p>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  backgroundColor: category.isActive ? "#dcfce7" : "#f5f5f5",
                  color: category.isActive ? "#15803d" : "#737373",
                }}
              >
                {category.isActive ? "Activa" : "Inactiva"}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mt-3">
              {category._count.products} productos
            </p>

            <CategoryActions
              category={{
                id: category.id,
                name: category.name,
                isActive: category.isActive,
                productCount: category._count.products,
              }}
            />
          </div>
        ))}
      </div>

      {/* Formulario para crear categoría */}
      <div
        className="mt-8 bg-white rounded-2xl border border-border"
        style={{ padding: "24px" }}
      >
        <h2 className="font-semibold mb-4">Nueva categoría</h2>
        <NewCategoryForm />
      </div>
    </div>
  );
}

// Importá esto arriba
import { NewCategoryForm } from "@/components/admin/new-category-form";
