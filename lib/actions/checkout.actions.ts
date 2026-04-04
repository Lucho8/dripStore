"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface CheckoutItem {
  name: string;
  price: number; // The client price (we shouldn't trust this)
  quantity: number;
  image: string;
  variantId: string;
}

export async function createCheckoutSession(items: CheckoutItem[]) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // 1. Fetch real prices from the database for security
  const variantIds = items.map((item) => item.variantId);
  const dbVariants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  // Map database variants for easy lookup
  const dbVariantsMap = new Map();
  dbVariants.forEach((v) => dbVariantsMap.set(v.id, v));

  let totalAmount = 0;
  const validItems = [];

  for (const item of items) {
    const dbVariant = dbVariantsMap.get(item.variantId);
    if (!dbVariant) continue;

    const realPrice = Number(dbVariant.price ?? dbVariant.product.basePrice);
    totalAmount += realPrice * item.quantity;

    validItems.push({
      ...item,
      realPrice,
      dbVariant,
    });
  }

  // 2. Create the Order in PENDING status in the database first
  const order = await db.order.create({
    data: {
      userId: session.user.id,
      total: totalAmount,
      status: "PENDING",
      items: {
        create: validItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: item.realPrice,
        })),
      },
    },
  });

  // 3. Prepare Stripe line items using verified prices
  const lineItems = validItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.dbVariant.product.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.realPrice * 100),
    },
    quantity: item.quantity,
  }));

  // 4. Create Stripe Checkout Session, passing ONLY the orderId in metadata
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    metadata: {
      orderId: order.id,
      userId: session.user.id,
    },
  });

  redirect(checkoutSession.url!);
}