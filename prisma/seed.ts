import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
});
const adapter = new PrismaPg(pool as any);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Sembrando datos...");

  // Categorías
  const remeras = await db.category.upsert({
    where: { slug: "remeras" },
    update: {},
    create: { name: "Remeras", slug: "remeras" },
  });

  const pantalones = await db.category.upsert({
    where: { slug: "pantalones" },
    update: {},
    create: { name: "Pantalones", slug: "pantalones" },
  });

  const buzos = await db.category.upsert({
    where: { slug: "buzos" },
    update: {},
    create: { name: "Buzos", slug: "buzos" },
  });

  const accesorios = await db.category.upsert({
    where: { slug: "accesorios" },
    update: {},
    create: { name: "Accesorios", slug: "accesorios" },
  });

  // Colores
  const negro = await db.color.upsert({
    where: { id: "color-negro" },
    update: {},
    create: { id: "color-negro", name: "Negro", hexCode: "#000000" },
  });

  const blanco = await db.color.upsert({
    where: { id: "color-blanco" },
    update: {},
    create: { id: "color-blanco", name: "Blanco", hexCode: "#FFFFFF" },
  });

  const gris = await db.color.upsert({
    where: { id: "color-gris" },
    update: {},
    create: { id: "color-gris", name: "Gris", hexCode: "#808080" },
  });

  // Talles
  const talles = ["XS", "S", "M", "L", "XL", "XXL"];
  const tallesCreados = await Promise.all(
    talles.map((name, index) =>
      db.size.upsert({
        where: { id: `size-${name.toLowerCase()}` },
        update: {},
        create: { id: `size-${name.toLowerCase()}`, name, order: index },
      }),
    ),
  );

  // Productos
  const productos = [
    {
      name: "Remera Oversized Basic",
      slug: "remera-oversized-basic",
      description:
        "Remera oversized de algodón 100%. Corte relajado, perfecta para el día a día.",
      basePrice: 15000,
      categoryId: remeras.id,
      isFeatured: true,
    },
    {
      name: "Remera Graphic Drip",
      slug: "remera-graphic-drip",
      description:
        "Remera con estampa exclusiva de Drip Store. Edición limitada.",
      basePrice: 18000,
      categoryId: remeras.id,
      isFeatured: true,
    },
    {
      name: "Pantalón Cargo Urbano",
      slug: "pantalon-cargo-urbano",
      description:
        "Pantalón cargo con múltiples bolsillos. Tela resistente ideal para el streetwear.",
      basePrice: 35000,
      categoryId: pantalones.id,
      isFeatured: true,
    },
    {
      name: "Buzo Hoodie Classic",
      slug: "buzo-hoodie-classic",
      description:
        "Hoodie de algodón grueso con capucha ajustable. Abriga y tiene estilo.",
      basePrice: 28000,
      categoryId: buzos.id,
      isFeatured: true,
    },
  ];

  for (const producto of productos) {
    const creado = await db.product.upsert({
      where: { slug: producto.slug },
      update: {},
      create: {
        ...producto,
        basePrice: producto.basePrice,
        images: {
          create: {
            url: `https://placehold.co/600x800/1a1a1a/ffffff?text=${encodeURIComponent(producto.name)}`,
            isPrimary: true,
            order: 0,
          },
        },
      },
    });

    // Variantes para cada producto
    for (const color of [negro, blanco, gris]) {
      for (const talle of tallesCreados.slice(1, 5)) {
        await db.productVariant.upsert({
          where: {
            productId_colorId_sizeId: {
              productId: creado.id,
              colorId: color.id,
              sizeId: talle.id,
            },
          },
          update: {},
          create: {
            productId: creado.id,
            colorId: color.id,
            sizeId: talle.id,
            stock: 10,
          },
        });
      }
    }

    console.log(`✅ ${producto.name}`);
  }

  console.log("🎉 Seed completado!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
