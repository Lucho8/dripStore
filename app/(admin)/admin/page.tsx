import { db } from "@/lib/db";
import { ShoppingCart, Package, DollarSign, Users, TrendingUp } from "lucide-react";
import { RevenueChart } from "@/components/admin/revenue-chart";

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

  // Obtener órdenes pagadas de los últimos 30 días para el gráfico
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentOrders = await db.order.findMany({
    where: {
      status: "PAID",
      createdAt: {
        gte: thirtyDaysAgo,
      }
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    }
  });

  // Agrupar ingresos por fecha (día/mes)
  const revenueByDateMap = new Map<string, number>();

  recentOrders.forEach((order) => {
    const dateStr = order.createdAt.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short"
    });

    const currentTotal = revenueByDateMap.get(dateStr) || 0;
    revenueByDateMap.set(dateStr, currentTotal + Number(order.total));
  });

  const chartData = Array.from(revenueByDateMap.entries()).map(([date, amount]) => ({
    date,
    revenue: amount,
  }));

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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-border flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon size={18} className="text-muted-foreground" />
            </div>
            <span className="text-3xl font-bold">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Gráfico de ingresos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Ingresos recientes</h2>
              <p className="text-sm text-muted-foreground">Últimos 30 días</p>
            </div>
            <div className="p-2 bg-neutral-100 rounded-lg">
              <TrendingUp size={20} className="text-neutral-600" />
            </div>
          </div>
          <RevenueChart data={chartData} />
        </div>

        {/* Espacio reservado para actividad reciente u otro widget futuro */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h2 className="text-lg font-bold mb-4">Actividad rápida</h2>
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground bg-neutral-50 rounded-xl border border-dashed p-6">
            <Package size={32} className="mb-3 text-neutral-300" />
            <p className="text-sm">En el futuro, aquí se mostrarán las últimas órdenes pendientes de preparar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}