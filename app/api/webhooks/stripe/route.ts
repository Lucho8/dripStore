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

    // Crear la orden en la DB
    await db.order.create({
      data: {
        userId,
        total,
        stripePaymentId: session.payment_intent as string,
        status: "PAID",
      },
    });
  }

  return NextResponse.json({ received: true });
}
