"use server";

import { db } from "@/lib/db";

export async function createCategory(name: string) {
  try {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) return { error: "Ya existe una categoría con ese nombre" };

    await db.category.create({
      data: { name, slug },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error al crear la categoría" };
  }
}

export async function toggleCategoryStatus(id: string, isActive: boolean) {
  try {
    await db.category.update({
      where: { id },
      data: { isActive },
    });
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar la categoría" };
  }
}
