import { db } from "@/lib/db";
import { NewColorForm } from "@/components/admin/new-color-form";
import { NewSizeForm } from "@/components/admin/new-size-form";
import { DeleteColorButton } from "@/components/admin/delete-color-button";
import { DeleteSizeButton } from "@/components/admin/delete-size-button";

export default async function ColorsAndSizesPage() {
  const [colors, sizes] = await Promise.all([
    db.color.findMany({ orderBy: { name: "asc" } }),
    db.size.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div style={{ padding: "32px" }}>
      <h1 className="text-2xl font-bold mb-8">Colores y Talles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colores */}
        <div
          className="bg-white rounded-2xl border border-border"
          style={{ padding: "24px" }}
        >
          <h2 className="font-semibold mb-4">Colores ({colors.length})</h2>

          <div className="flex flex-col gap-2 mb-6">
            {colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-full border border-border"
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: color.hexCode,
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">{color.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {color.hexCode}
                    </p>
                  </div>
                </div>
                <DeleteColorButton colorId={color.id} colorName={color.name} />
              </div>
            ))}
          </div>

          <NewColorForm />
        </div>

        {/* Talles */}
        <div
          className="bg-white rounded-2xl border border-border"
          style={{ padding: "24px" }}
        >
          <h2 className="font-semibold mb-4">Talles ({sizes.length})</h2>

          <div className="flex flex-col gap-2 mb-6">
            {sizes.map((size) => (
              <div
                key={size.id}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8 text-center py-1 rounded-lg bg-neutral-200">
                    {size.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Orden: {size.order}
                  </span>
                </div>
                <DeleteSizeButton sizeId={size.id} sizeName={size.name} />
              </div>
            ))}
          </div>

          <NewSizeForm nextOrder={sizes.length} />
        </div>
      </div>
    </div>
  );
}
