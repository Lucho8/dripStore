"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/actions/upload.actions";
import { createProduct } from "@/lib/actions/product.actions";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}
interface Color {
  id: string;
  name: string;
  hexCode: string;
}
interface Size {
  id: string;
  name: string;
  order: number;
}

interface ProductFormProps {
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

interface VariantInput {
  colorId: string;
  sizeId: string;
  stock: number;
  price: string;
}

export function ProductForm({ categories, colors, sizes }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [variants, setVariants] = useState<VariantInput[]>([]);

  const [values, setValues] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    isFeatured: false,
  });

  // ============================================
  // SUBIR IMAGEN
  // ============================================
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);
    if (result.url) setImageUrl(result.url);
    setUploadingImage(false);
  }

  // ============================================
  // VARIANTES
  // ============================================
  function addVariant() {
    setVariants([
      ...variants,
      {
        colorId: colors[0]?.id ?? "",
        sizeId: sizes[0]?.id ?? "",
        stock: 0,
        price: "",
      },
    ]);
  }

  function updateVariant(
    index: number,
    field: keyof VariantInput,
    value: string | number,
  ) {
    setVariants(
      variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  // ============================================
  // SUBMIT
  // ============================================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Subí una imagen primero");
      return;
    }
    if (variants.length === 0) {
      toast.error("Agregá al menos una variante");
      return;
    }

    const variantKeys = variants.map((v) => `${v.colorId}-${v.sizeId}`);
    const hasDuplicates = variantKeys.length !== new Set(variantKeys).size;
    if (hasDuplicates) {
      toast.error("Hay variantes duplicadas — revisá color y talle");
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await createProduct({
      ...values,
      basePrice: parseFloat(values.basePrice),
      imageUrl,
      variants,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("¡Producto creado correctamente!");
    setTimeout(() => {
      router.push("/admin/products");
      router.refresh();
    }, 1000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      {/* Imagen */}
      <div
        className="bg-white rounded-2xl border border-border"
        style={{ padding: "24px" }}
      >
        <h2 className="font-semibold mb-4">Imagen principal</h2>
        <div className="flex items-start gap-4">
          {imageUrl ? (
            <div
              className="relative"
              style={{ width: "120px", height: "160px" }}
            >
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="absolute -top-2 -right-2 bg-white border border-border rounded-full p-1 hover:bg-neutral-100 transition"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-foreground transition cursor-pointer"
              style={{ width: "120px", height: "160px" }}
            >
              <Upload size={20} className="text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground text-center">
                {uploadingImage ? "Subiendo..." : "Subir imagen"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Datos básicos */}
      <div
        className="bg-white rounded-2xl border border-border"
        style={{ padding: "24px" }}
      >
        <h2 className="font-semibold mb-4">Información básica</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre</label>
            <input
              required
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Remera Oversized Basic"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              required
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              placeholder="Descripción del producto..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Precio base (USD)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={values.basePrice}
                onChange={(e) =>
                  setValues({ ...values, basePrice: e.target.value })
                }
                placeholder="29.99"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Categoría</label>
              <select
                required
                value={values.categoryId}
                onChange={(e) =>
                  setValues({ ...values, categoryId: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
              >
                <option value="">Seleccioná una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={values.isFeatured}
              onChange={(e) =>
                setValues({ ...values, isFeatured: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium">
              Producto destacado (aparece en la home)
            </label>
          </div>
        </div>
      </div>

      {/* Variantes */}
      <div
        className="bg-white rounded-2xl border border-border"
        style={{ padding: "24px" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Variantes</h2>
          <button
            type="button"
            onClick={addVariant}
            className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-neutral-100 transition"
          >
            + Agregar variante
          </button>
        </div>

        {variants.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No hay variantes todavía. Agregá color + talle + stock.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-border"
              >
                {/* Color */}
                <select
                  value={variant.colorId}
                  onChange={(e) =>
                    updateVariant(index, "colorId", e.target.value)
                  }
                  className="flex-1 px-2 py-1.5 rounded-lg border border-input bg-white text-sm outline-none"
                >
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))}
                </select>

                {/* Talle */}
                <select
                  value={variant.sizeId}
                  onChange={(e) =>
                    updateVariant(index, "sizeId", e.target.value)
                  }
                  className="flex-1 px-2 py-1.5 rounded-lg border border-input bg-white text-sm outline-none"
                >
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>

                {/* Stock */}
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(index, "stock", parseInt(e.target.value))
                  }
                  placeholder="Stock"
                  className="w-20 px-2 py-1.5 rounded-lg border border-input bg-white text-sm outline-none text-center"
                />

                {/* Precio opcional */}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(index, "price", e.target.value)
                  }
                  placeholder="Precio (opcional)"
                  className="w-32 px-2 py-1.5 rounded-lg border border-input bg-white text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-muted-foreground hover:text-destructive transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Creando..." : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-neutral-100 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
