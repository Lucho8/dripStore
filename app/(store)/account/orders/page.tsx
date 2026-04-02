import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    PAID: "Pagado",
    PROCESSING: "Procesando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
  };

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          variant: {
            include: {
              color: true,
              size: true,
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div style={{ maxWidth: "896px", margin: "0 auto", padding: "48px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <Link
          href="/account"
          className="text-muted-foreground hover:text-foreground"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#f5f5f5",
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold m-0">Mis Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div
          className="bg-card"
          style={{
            padding: "64px 24px",
            textAlign: "center",
            border: "1px solid #e5e5e5",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Package size={48} className="text-muted-foreground" />
          <div>
            <h2 className="text-xl font-bold">Aún no tienes pedidos</h2>
            <p className="text-muted-foreground mt-2">
              Cuando hagas una compra, aparecerá aquí.
            </p>
          </div>
          <Link
            href="/products"
            className="bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              marginTop: "8px",
            }}
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card"
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  backgroundColor: "#fafafa",
                  borderBottom: "1px solid #e5e5e5",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Fecha de pedido
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Total
                    </p>
                    <p className="text-sm font-medium mt-1">
                      ${Number(order.total).toLocaleString("es-AR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Estado
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "2px 10px",
                        borderRadius: "9999px",
                        backgroundColor:
                          order.status === "PAID" ? "#dcfce7" : "#f3f4f6",
                        color: order.status === "PAID" ? "#166534" : "#374151",
                      }}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Ver detalles <ExternalLink size={14} />
                  </Link>
                </div>
              </div>

              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {order.items.map((item) => {
                  const product = item.variant.product;
                  // Obtenemos la primera imagen (si existe)
                  const productImage = product.images?.[0]?.url;

                  return (
                    <div key={item.id} style={{ display: "flex", gap: "16px" }}>
                      <div
                        style={{
                          width: "64px",
                          height: "80px",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "8px",
                          flexShrink: 0,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {productImage ? (
                          <Image
                            src={productImage}
                            alt={product.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Package
                              size={20}
                              className="text-muted-foreground"
                            />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 className="font-medium text-sm">
                          <Link
                            href={`/products/${product.slug}`}
                            className="hover:underline text-foreground"
                          >
                            {product.name}
                          </Link>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.variant.color.name} / {item.variant.size.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Cant: {item.quantity} x $
                          {Number(item.priceAtPurchase).toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
