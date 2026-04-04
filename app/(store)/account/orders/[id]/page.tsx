import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const order = await db.order.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      address: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
              color: true,
              size: true,
            },
          },
        },
      },
    },
  });

  if (!order) redirect("/account/orders");

  return (
    <div style={{ maxWidth: "896px", margin: "0 auto", padding: "48px 16px" }}>
      {/* Botón Volver */}
      <Link
        href="/account/orders"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          color: "#737373",
          textDecoration: "none",
          marginBottom: "32px",
          transition: "color 0.2s",
        }}
      >
        <ArrowLeft size={16} /> Volver a mis pedidos
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: "bold", margin: 0 }}>
            Orden #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p
            style={{
              color: "#737373",
              marginTop: "4px",
              fontSize: "14px",
              margin: "4px 0 0 0",
            }}
          >
            Realizada el{" "}
            {new Date(order.createdAt).toLocaleDateString("es-AR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: order.status === "PAID" ? "#dcfce7" : "#f5f5f5",
            color: order.status === "PAID" ? "#166534" : "#171717",
          }}
        >
          {order.status === "PAID" ? "Pago Aprobado" : order.status}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "32px" }}>
        {/* Columna Izquierda: Lista de Productos */}
        <div
          style={{
            flex: "2 1 500px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid #e5e5e5",
                backgroundColor: "#fafafa",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: 0,
                }}
              >
                <Package size={20} color="#737373" />
                Artículos ({order.items.length})
              </h2>
            </div>

            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {order.items.map((item) => {
                const product = item.variant.product;
                const image = product.images?.[0]?.url;

                return (
                  <div key={item.id} style={{ display: "flex", gap: "16px" }}>
                    <div
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "96px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "12px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {image ? (
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          style={{ objectFit: "cover" }}
                          unoptimized
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
                          <Package size={24} color="#737373" />
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "4px 0",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            margin: 0,
                          }}
                        >
                          <Link
                            href={`/products/${product.slug}`}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            {product.name}
                          </Link>
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#737373",
                            margin: "4px 0 0 0",
                          }}
                        >
                          {item.variant.color.name} / {item.variant.size.name}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        <span style={{ fontSize: "14px", color: "#737373" }}>
                          Cant: {item.quantity}
                        </span>
                        <span style={{ fontSize: "16px", fontWeight: "500" }}>
                          $
                          {Number(item.priceAtPurchase).toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen y Envío */}
        <div
          style={{
            flex: "1 1 300px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Resumen de Pago */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "0 0 16px 0",
              }}
            >
              <CreditCard size={20} color="#737373" />
              Resumen
            </h2>
            <div
              style={{
                fontSize: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#737373",
                }}
              >
                <span>Subtotal</span>
                <span>${Number(order.total).toLocaleString("es-AR")}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#737373",
                }}
              >
                <span>Envío</span>
                <span style={{ color: "#16a34a", fontWeight: "500" }}>
                  Gratis
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px solid #e5e5e5",
                  paddingTop: "12px",
                  marginTop: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <span>Total</span>
                <span>${Number(order.total).toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>

          {/* Información de Envío */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "0 0 16px 0",
              }}
            >
              <MapPin size={20} color="#737373" />
              Dirección de Envío
            </h2>
            {order.address ? (
              <div
                style={{
                  fontSize: "14px",
                  color: "#737373",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <p style={{ color: "#171717", fontWeight: "500", margin: 0 }}>
                  {order.address.street}
                </p>
                <p style={{ margin: 0 }}>
                  {order.address.city}, {order.address.province}
                </p>
                <p style={{ margin: 0 }}>CP: {order.address.zipCode}</p>
              </div>
            ) : (
              <p style={{ fontSize: "14px", color: "#737373", margin: 0 }}>
                No se especificó dirección de envío en esta orden.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
