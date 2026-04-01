import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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

    const userId = session.metadata?.userId;
    if (!userId)
      return NextResponse.json({ error: "No userId" }, { status: 400 });

    // Obtener los items de la sesión de Stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Calcular el total
    const total = (session.amount_total ?? 0) / 100;

    const itemsMetadata = session.metadata?.items;
    let items = [];
    if (itemsMetadata) {
      try {
        items = JSON.parse(itemsMetadata);
      } catch (e) {
        console.error("Failed to parse items metadata", e);
      }
    }

    // Wrap operations in a transaction
    await db.$transaction(async (tx) => {
      // Crear la orden en la DB
      const order = await tx.order.create({
        data: {
          userId,
          total,
          stripePaymentId: session.payment_intent as string,
          status: "PAID",
        },
      });

      // Crear OrderItems y descontar stock
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          },
        });

        // Bajar stock de la variante comprada
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    });
  }

  return NextResponse.json({ received: true });
}
