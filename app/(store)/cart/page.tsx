"use client";

import { useCartStore } from "@/lib/store/cart.store";
import { Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createCheckoutSession } from "@/lib/actions/checkout.actions";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  async function handleCheckout() {
    setLoadingCheckout(true);
    await createCheckoutSession(
      items.map((item) => ({
        name: `${item.name} — ${item.color} / ${item.size}`,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    );
    setLoadingCheckout(false);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
        <ShoppingBag size={48} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="text-muted-foreground">Agregá productos para continuar</p>
        <Link
          href="/products"
          className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-xl mx-auto px-4 py-12"
      style={{ maxWidth: "55%" }}
    >
      <h1 className="text-2xl font-bold mb-8">Tu carrito ({items.length})</h1>

      <div className="flex flex-col gap-3">
        {/* Items */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 p-4 rounded-2xl border border-border bg-card"
            >
              {/* Imagen */}
              <div
                className="relative rounded-xl overflow-hidden bg-neutral-100 shrink-0"
                style={{ width: "80px", height: "112px" }}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.color} — {item.size}
                </p>
                <p className="text-sm font-bold mt-1">
                  ${(item.price * item.quantity).toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${item.price.toLocaleString("es-AR")} c/u
                </p>

                {/* Cantidad */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity - 1)
                    }
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-neutral-100 transition font-medium"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.variantId,
                        Math.min(item.stock, item.quantity + 1),
                      )
                    }
                    disabled={item.quantity >= item.stock}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-neutral-100 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Eliminar */}
              <button
                onClick={() => removeItem(item.variantId)}
                className="text-muted-foreground hover:text-destructive transition shrink-0 self-start"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div>
          <div
            className="p-5 rounded-2xl border border-border bg-card flex flex-col gap-4 sticky top-24"
            style={{ padding: "24px 32px" }}
          >
            <h2 className="font-bold">Resumen de compra</h2>

            <div className="flex flex-col gap-2 text-sm px-1">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex justify-between text-muted-foreground"
                >
                  <span className="truncate mr-2">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="shrink-0">
                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${total().toLocaleString("es-AR")}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loadingCheckout}
              style={{ padding: "12px 48px" }}
              className="mx-auto rounded-xl bg-primary text-primary-foreground text-sm font-medium text-center hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCheckout ? "Redirigiendo..." : "Ir al checkout"}
            </button>
            <Link
              href="/products"
              className="text-center text-sm text-muted-foreground hover:text-foreground transition"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
