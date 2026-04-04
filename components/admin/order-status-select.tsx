"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/actions/order.actions";
import { OrderStatus } from "@/lib/generated/prisma/client";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pendiente" },
  { value: "PAID", label: "Pagado" },
  { value: "PROCESSING", label: "Procesando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as OrderStatus;
    setLoading(true);
    const result = await updateOrderStatus(orderId, newStatus);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setStatus(newStatus);
    toast.success("Estado actualizado");
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="text-sm rounded-lg border border-input bg-background outline-none transition disabled:opacity-50"
      style={{ padding: "4px 8px" }}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
