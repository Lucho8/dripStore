"use server";

import { db } from "@/lib/db";

interface CreateProductInput {
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  isFeatured: boolean;
  imageUrl: string;
  variants: {
    colorId: string;
    sizeId: string;
    stock: number;
    price: string;
  }[];
}

export async function createProduct(data: CreateProductInput) {
  try {
    const slug = data.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) return { error: "Ya existe un producto con ese nombre" };

    await db.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        images: {
          create: {
            url: data.imageUrl,
            isPrimary: true,
            order: 0,
          },
        },
        variants: {
          create: data.variants.map((v) => ({
            colorId: v.colorId,
            sizeId: v.sizeId,
            stock: v.stock,
            price: v.price ? parseFloat(v.price) : null,
          })),
        },
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error al crear el producto" };
  }
}

export async function updateProduct(data: {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  imageUrl: string;
  variants: {
    id?: string;
    colorId: string;
    sizeId: string;
    stock: number;
    price: string;
  }[];
}) {
  try {
    await db.productVariant.deleteMany({
      where: { productId: data.id },
    });

    await db.productImage.deleteMany({
      where: { productId: data.id },
    });

    await db.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        images: {
          create: {
            url: data.imageUrl,
            isPrimary: true,
            order: 0,
          },
        },
        variants: {
          create: data.variants.map((v) => ({
            colorId: v.colorId,
            sizeId: v.sizeId,
            stock: v.stock,
            price: v.price ? parseFloat(v.price) : null,
          })),
        },
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el producto" };
  }
}
