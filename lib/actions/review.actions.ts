"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createReview(
  productId: string,
  rating: number,
  comment?: string,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Debes iniciar sesión para dejar una reseña." };
    }

    if (rating < 1 || rating > 5) {
      return { error: "La calificación debe estar entre 1 y 5 estrellas." };
    }

    // Verificar si el usuario ya dejó una reseña para este producto
    const existingReview = await db.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });

    if (existingReview) {
      return { error: "Ya has dejado una reseña para este producto." };
    }

    await db.review.create({
      data: {
        rating,
        comment: comment || null,
        userId: session.user.id,
        productId,
      },
    });

    // Revalidar las rutas para que se actualicen los promedios y reseñas mostradas
    revalidatePath("/products");
    revalidatePath(`/products/[slug]`, "page");

    return { success: true };
  } catch (error) {
    console.error("Error creando reseña:", error);
    return { error: "Hubo un error al guardar tu reseña." };
  }
}