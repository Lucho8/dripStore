"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId: string;
}

export async function createCheckoutSession(items: CheckoutItem[]) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const variantIds = items.map((item) => item.variantId);
  const dbVariants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

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