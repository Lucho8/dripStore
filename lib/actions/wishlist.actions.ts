"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Debes iniciar sesión para guardar favoritos." };
    }

    const userId = session.user.id;

    const existingItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      await db.wishlistItem.delete({
        where: { id: existingItem.id },
      });
      revalidatePath("/products");
      return { success: true, isFavorited: false };
    } else {
      await db.wishlistItem.create({
        data: {
          userId,
          productId,
        },
      });
      revalidatePath("/products");
      return { success: true, isFavorited: true };
    }
  } catch (error) {
    console.error("Error al modificar wishlist:", error);
    return { error: "Ocurrió un error inesperado." };
  }
}
