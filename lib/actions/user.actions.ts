"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

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

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const name = formData.get("name") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const dataToUpdate: any = {};

    if (name) {
      dataToUpdate.name = name;
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return { error: "Las contraseñas no coinciden" };
      }
      if (newPassword.length < 6) {
        return { error: "La contraseña debe tener al menos 6 caracteres" };
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      dataToUpdate.password = hashedPassword;
    }

    await db.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar el perfil" };
  }
}

export async function deactivateOwnAccount() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    // Buscamos al usuario para saber su rol
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    // Validamos que no sea ADMIN
    if (user?.role === "ADMIN") {
      return {
        error: "Los administradores no pueden desactivar su propia cuenta",
      };
    }

    // Desactivamos
    await db.user.update({
      where: { id: session.user.id },
      data: { isActive: false },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al desactivar la cuenta" };
  }
}
