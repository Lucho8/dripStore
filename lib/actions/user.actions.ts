"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function toggleUserStatus(userId: string, isActive: boolean) {
  try {
    const session = await auth();

    // No podés desactivarte a vos mismo
    if (session?.user?.id === userId) {
      return { error: "No podés desactivar tu propia cuenta" };
    }

    await db.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el usuario" };
  }
}

export async function toggleUserRole(userId: string, role: string) {
  try {
    const session = await auth();

    // No podés cambiar tu propio rol
    if (session?.user?.id === userId) {
      return { error: "No podés cambiar tu propio rol" };
    }

    await db.user.update({
      where: { id: userId },
      data: { role: role as "USER" | "ADMIN" },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el rol" };
  }
}
