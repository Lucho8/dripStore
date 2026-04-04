import { db } from "@/lib/db";
import { OrderStatus } from "@/lib/generated/prisma/client";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Eye } from "lucide-react";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: "32px" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Órdenes</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {orders.length} órdenes en total
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                ID
              </th>
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Cliente
              </th>
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Items
              </th>
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Total
              </th>
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Fecha
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
                Ver Detalle
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0 hover:bg-neutral-50 transition"
              >
                <td style={{ padding: "12px 16px" }}>
                  <span className="text-xs text-muted-foreground font-mono">
                    #{order.id.slice(-8)}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div>
                    <p className="text-sm font-medium">{order.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.user.email}
                    </p>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className="text-sm text-muted-foreground">
                    {order.items.length} items
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className="text-sm font-semibold">
                    ${Number(order.total).toLocaleString("es-AR")}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 transition text-muted-foreground hover:text-foreground inline-flex"
                  >
                    <Eye size={15} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
