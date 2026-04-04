import { OrderStatus } from "@/lib/generated/prisma/client";

const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; color: string }
> = {
  PENDING: { label: "Pendiente", bg: "#fef9c3", color: "#854d0e" },
  PAID: { label: "Pagado", bg: "#dcfce7", color: "#15803d" },
  PROCESSING: { label: "Procesando", bg: "#dbeafe", color: "#1d4ed8" },
  SHIPPED: { label: "Enviado", bg: "#f3e8ff", color: "#7e22ce" },
  DELIVERED: { label: "Entregado", bg: "#d1fae5", color: "#065f46" },
  CANCELLED: { label: "Cancelado", bg: "#fee2e2", color: "#b91c1c" },
  REFUNDED: { label: "Reembolsado", bg: "#f1f5f9", color: "#475569" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span
      style={{
        fontSize: "12px",
        fontWeight: "500",
        padding: "2px 8px",
        borderRadius: "9999px",
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}
