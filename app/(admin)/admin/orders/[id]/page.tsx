import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: { where: { isPrimary: true } } }
              },
              color: true,
              size: true,
            }
          }
        }
      },
      address: true,
      shipment: true,
    }
  })

  if (!order) notFound()

  return (
    <div style={{ padding: '32px' }}>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/orders"
          className="p-2 rounded-lg border border-border hover:bg-neutral-100 transition"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            Orden #{order.id.slice(-8)}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(order.createdAt).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-border" style={{ padding: '24px' }}>
            <h2 className="font-semibold mb-4">Productos</h2>

            {order.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Esta orden no tiene items registrados.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div
                      className="rounded-xl bg-neutral-100 overflow-hidden shrink-0"
                      style={{ width: '56px', height: '72px' }}
                    >
                      {item.variant.product.images[0] && (
                        <img
                          src={item.variant.product.images[0].url}
                          alt={item.variant.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.variant.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.variant.color.name} — {item.variant.size.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        x{item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ${(Number(item.priceAtPurchase) * item.quantity).toLocaleString("es-AR")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${Number(item.priceAtPurchase).toLocaleString("es-AR")} c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Envío */}
          {order.shipment && (
            <div className="bg-white rounded-2xl border border-border" style={{ padding: '24px' }}>
              <h2 className="font-semibold mb-4">Envío</h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transportista</span>
                  <span>{order.shipment.carrier ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking</span>
                  <span>{order.shipment.trackingCode ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <span>{order.shipment.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="flex flex-col gap-4">

          {/* Total */}
          <div className="bg-white rounded-2xl border border-border" style={{ padding: '24px' }}>
            <h2 className="font-semibold mb-4">Resumen</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${Number(order.total).toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border mt-1">
                <span>Total</span>
                <span>${Number(order.total).toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="bg-white rounded-2xl border border-border" style={{ padding: '24px' }}>
            <h2 className="font-semibold mb-4">Cliente</h2>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{order.user.name}</p>
              <p className="text-sm text-muted-foreground">{order.user.email}</p>
            </div>
          </div>

          {/* Dirección */}
          {order.address && (
            <div className="bg-white rounded-2xl border border-border" style={{ padding: '24px' }}>
              <h2 className="font-semibold mb-4">Dirección de entrega</h2>
              <div className="text-sm text-muted-foreground flex flex-col gap-1">
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.province}</p>
                <p>{order.address.zipCode} — {order.address.country}</p>
              </div>
            </div>
          )}

          {/* Stripe */}
          {order.stripePaymentId && (
            <div className="bg-white rounded-2xl border border-border" style={{ padding: '24px' }}>
              <h2 className="font-semibold mb-2">Pago</h2>
              <p className="text-xs text-muted-foreground font-mono break-all">
                {order.stripePaymentId}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}