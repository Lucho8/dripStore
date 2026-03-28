"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart.store";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
      <CheckCircle size={64} className="text-green-500" />
      <h1 className="text-3xl font-bold">¡Compra realizada!</h1>
      <p className="text-muted-foreground">
        Gracias por tu compra. Te enviaremos un email con los detalles de tu
        pedido.
      </p>
      <Link
        href="/products"
        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
      >
        Seguir comprando
      </Link>
    </div>
  );
}
