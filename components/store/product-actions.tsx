"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart.store";
import { toast } from "sonner";

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
interface Variant {
  id: string;
  colorId: string;
  sizeId: string;
  stock: number;
  price: number | null;
}

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    basePrice: number;
    image: string;
  };
  colors: Color[];
  sizes: Size[];
  variants: Variant[];
}

export function ProductActions({
  product,
  colors,
  sizes,
  variants,
}: ProductActionsProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Variante activa según color y talle seleccionados
  const activeVariant = variants.find(
    (v) => v.colorId === selectedColor && v.sizeId === selectedSize,
  );

  const price = activeVariant?.price ?? product.basePrice;
  const stock = activeVariant?.stock ?? 0;
  const canAdd = !!activeVariant && stock > 0;

  function handleAddToCart() {
    if (!activeVariant) return;
    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      name: product.name,
      price,
      image: product.image,
      color: colors.find((c) => c.id === selectedColor)?.name ?? "",
      size: sizes.find((s) => s.id === selectedSize)?.name ?? "",
      quantity,
      stock,
    });
    toast.success(`¡${product.name} agregado al carrito!`, {
      description: `${colors.find((c) => c.id === selectedColor)?.name} — ${sizes.find((s) => s.id === selectedSize)?.name}`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Colores */}
      <div>
        <p className="text-sm font-medium mb-3">
          Color{" "}
          {selectedColor && (
            <span className="text-muted-foreground font-normal">
              — {colors.find((c) => c.id === selectedColor)?.name}
            </span>
          )}
        </p>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => {
                setSelectedColor(color.id);
                setSelectedSize(null);
              }}
              className={`w-8 h-8 rounded-full border-2 transition ring-1 ring-border
                ${
                  selectedColor === color.id
                    ? "border-foreground scale-110"
                    : "border-transparent hover:border-muted-foreground"
                }`}
              style={{ backgroundColor: color.hexCode }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Talles */}
      <div>
        <p className="text-sm font-medium mb-3">Talle</p>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size) => {
            const variant = variants.find(
              (v) => v.colorId === selectedColor && v.sizeId === size.id,
            );
            const outOfStock =
              selectedColor && (!variant || variant.stock === 0);

            return (
              <button
                key={size.id}
                onClick={() => !outOfStock && setSelectedSize(size.id)}
                disabled={!!outOfStock}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition relative
                  ${
                    selectedSize === size.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : outOfStock
                        ? "border-border text-muted-foreground opacity-40 cursor-not-allowed line-through"
                        : "border-border hover:border-foreground"
                  }`}
              >
                {size.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock bajo */}
      {activeVariant && stock <= 5 && stock > 0 && (
        <p className="text-sm text-orange-500 font-medium">
          ⚠️ Solo quedan {stock} unidades
        </p>
      )}

      {/* Cantidad */}
      {canAdd && (
        <div>
          <p className="text-sm font-medium mb-3">Cantidad</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-foreground transition"
            >
              −
            </button>
            <span className="text-sm font-medium w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(stock, quantity + 1))}
              disabled={quantity >= stock}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-foreground transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Botón */}
      <button
        onClick={handleAddToCart}
        disabled={!canAdd}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={18} />
        {!selectedColor || !selectedSize
          ? "Seleccioná color y talle"
          : stock === 0
            ? "Sin stock"
            : "Agregar al carrito"}
      </button>
    </div>
  );
}
