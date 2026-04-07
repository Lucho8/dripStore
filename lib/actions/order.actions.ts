"use server";

import { db } from "@/lib/db";
import { OrderStatus } from "@/lib/generated/prisma/client";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await db.order.update({
      where: { id: orderId },
      data: { status },
    });
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el estado" };
  }
}
