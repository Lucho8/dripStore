import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ReceiptEmail } from "@/components/emails/receipt-email";

// Inicializar cliente de Resend si hay una key configurada
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "No orderId in metadata" }, { status: 400 });
    }

    let userEmail = "";
    let emailData: any = null;

    await db.$transaction(async (tx) => {
      // 1. Actualizar estado de la orden y obtener datos del usuario
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentId: session.payment_intent as string,
        },
        include: {
          user: true,
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                }
              }
            }
          },
        },
      });

      // 2. Decrementar stock
      for (const item of updatedOrder.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Preparar datos para el email
      userEmail = updatedOrder.user.email;
      emailData = {
        orderId: updatedOrder.id,
        total: Number(updatedOrder.total),
        items: updatedOrder.items.map(item => ({
          name: item.variant.product.name,
          quantity: item.quantity,
          price: Number(item.priceAtPurchase)
        }))
      };
    });

    // 3. Enviar correo asincrónicamente fuera de la transacción de la BD
    if (resend && userEmail && emailData) {
      try {
        await resend.emails.send({
          // Si tienes un dominio en Resend usa ese, sino el "onboarding@resend.dev" solo funciona
          // para enviar correos a TU propia cuenta de email verificada en Resend (para testing).
          from: "Drip Store <onboarding@resend.dev>",
          to: userEmail,
          subject: `Recibo de tu compra #${emailData.orderId.slice(-6).toUpperCase()}`,
          react: ReceiptEmail(emailData),
        });
        console.log(`[STRIPE_WEBHOOK] Email sent successfully to ${userEmail}`);
      } catch (emailError) {
        console.error("[STRIPE_WEBHOOK] Error sending email:", emailError);
        // No arrojamos el error para no decirle a Stripe que falló el webhook si solo falló el email
      }
    }
  }

  return NextResponse.json({ received: true });
}