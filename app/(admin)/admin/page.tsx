import { db } from "@/lib/db";
import { ShoppingCart, Package, DollarSign, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [orders, products, users] = await Promise.all([
    db.order.count(),
    db.product.count(),
    db.user.count(),
  ]);

  const revenue = await db.order.aggregate({
    _sum: { total: true },
    where: { status: "PAID" },
  });

  const stats = [
    {
      label: "Ingresos totales",
      value: `$${Number(revenue._sum.total ?? 0).toLocaleString("es-AR")}`,
      icon: DollarSign,
    },
    {
      label: "Órdenes",
      value: orders,
      icon: ShoppingCart,
    },
    {
      label: "Productos",
      value: products,
      icon: Package,
    },
    {
      label: "Usuarios",
      value: users,
      icon: Users,
    },
  ];

  return (
    <div style={{ padding: "32px" }}>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-border flex flex-col gap-3"
            style={{ padding: "24px" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon size={18} className="text-muted-foreground" />
            </div>
            <span className="text-3xl font-bold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
