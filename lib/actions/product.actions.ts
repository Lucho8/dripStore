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
    console.error("[CREATE_PRODUCT_ERROR]", error);
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
    // 1. Obtener variantes existentes del producto en la base de datos
    const existingVariants = await db.productVariant.findMany({
      where: { productId: data.id },
      select: { id: true },
    });

    const existingVariantIds = existingVariants.map(v => v.id);
    const incomingVariantIds = data.variants.map(v => v.id).filter(Boolean) as string[];

    // 2. Determinar cuáles variantes debemos borrar (están en la BD pero no en el form)
    const variantsToDelete = existingVariantIds.filter(id => !incomingVariantIds.includes(id));

    // 3. Manejar las eliminaciones con gracia
    for (const idToDelete of variantsToDelete) {
      try {
        await db.productVariant.delete({ where: { id: idToDelete } });
      } catch (err: any) {
        // Si falla por Foreign Key Constraint, simplemente le ponemos stock 0 para "desactivarla"
        if (err.code === "P2003") {
          console.warn(`[UPDATE_PRODUCT] No se pudo borrar variante ${idToDelete} porque tiene dependencias. Fijando stock a 0.`);
          await db.productVariant.update({
            where: { id: idToDelete },
            data: { stock: 0 },
          });
        } else {
          throw err;
        }
      }
    }

    // 4. Actualizar las imágenes
    // Primero intentamos actualizar si ya existe la principal
    const existingImages = await db.productImage.findMany({
      where: { productId: data.id, isPrimary: true }
    });

    if (existingImages.length > 0) {
      await db.productImage.update({
        where: { id: existingImages[0].id },
        data: { url: data.imageUrl }
      });
    } else {
      await db.productImage.create({
        data: {
          productId: data.id,
          url: data.imageUrl,
          isPrimary: true,
          order: 0
        }
      });
    }

    // 5. Actualizar el producto base
    await db.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
      },
    });

    // 6. Actualizar (Upsert) cada variante entrante
    for (const variant of data.variants) {
      if (variant.id) {
        // Existe, la actualizamos
        await db.productVariant.update({
          where: { id: variant.id },
          data: {
            colorId: variant.colorId,
            sizeId: variant.sizeId,
            stock: variant.stock,
            price: variant.price ? parseFloat(variant.price) : null,
          }
        });
      } else {
        // No existe, la creamos
        await db.productVariant.create({
          data: {
            productId: data.id,
            colorId: variant.colorId,
            sizeId: variant.sizeId,
            stock: variant.stock,
            price: variant.price ? parseFloat(variant.price) : null,
          }
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("[UPDATE_PRODUCT_ERROR]", error);
    return { error: "Error al actualizar el producto" };
  }
}