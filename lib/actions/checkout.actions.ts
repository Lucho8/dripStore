"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export async function createCheckoutSession(items: CheckoutItem[]) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round((item.price / 1000) * 100),
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
      userId: session.user.id,
    },
  });

  redirect(checkoutSession.url!);
}
