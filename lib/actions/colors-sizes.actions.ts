"use server";

import { db } from "@/lib/db";

export async function createColor(name: string, hexCode: string) {
  try {
    await db.color.create({ data: { name, hexCode } });
    return { success: true };
  } catch (error) {
    return { error: "Error al crear el color" };
  }
}

export async function deleteColor(id: string) {
  try {
    const variants = await db.productVariant.count({ where: { colorId: id } });
    if (variants > 0) {
      return { error: `Este color tiene ${variants} variantes asociadas` };
    }
    await db.color.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el color" };
  }
}

export async function createSize(name: string, order: number) {
  try {
    await db.size.create({ data: { name, order } });
    return { success: true };
  } catch (error) {
    return { error: "Error al crear el talle" };
  }
}

export async function deleteSize(id: string) {
  try {
    const variants = await db.productVariant.count({ where: { sizeId: id } });
    if (variants > 0) {
      return { error: `Este talle tiene ${variants} variantes asociadas` };
    }
    await db.size.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el talle" };
  }
}
