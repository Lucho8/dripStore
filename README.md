# 💧 DripStore - Fullstack E-Commerce Platform

Una plataforma de comercio electrónico robusta, escalable y moderna construida con **Next.js 15**, enfocada en el rendimiento, la seguridad de los datos y una excelente experiencia de usuario. 

El proyecto incluye tanto la vista orientada al cliente (Storefront) como un completo Panel de Administración (Admin Dashboard) para gestionar todo el negocio.

## ✨ Características Principales

### 🛍️ Storefront (Para Clientes)
* **Catálogo Dinámico:** Navegación por productos con filtrado por categorías, colores y talles.
* **Carrito de Compras y Checkout:** Flujo de compra optimizado y seguro utilizando **Stripe**. Los precios se validan estrictamente en el servidor (backend) para evitar manipulaciones.
* **Lista de Deseos (Wishlist):** Sistema persistente para guardar productos favoritos.
* **Reseñas y Calificaciones:** Los usuarios pueden dejar feedback (1 a 5 estrellas) en los productos que compraron.
* **Autenticación Segura:** Login tradicional con credenciales y Social Login (Google) a través de **Auth.js**.
* **Panel de Usuario:** Historial de órdenes y gestión de la cuenta.

### 📊 Admin Dashboard (Para Administradores)
* **Gestión de Inventario (CRUD):** Creación y edición de productos, categorías, colores y talles.
* **Gestión de Órdenes:** Seguimiento y actualización del estado de las compras en tiempo real.
* **Analíticas de Ventas:** Visualización de ingresos de los últimos 30 días mediante gráficos interactivos (`recharts`).
* **Protección de Rutas:** Acceso restringido exclusivamente a usuarios con rol de Administrador.

---

## 🛠️ Stack Tecnológico

* **Framework:** Next.js 15 (App Router, Server Components, Server Actions)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS v4, Lucide Icons
* **Base de Datos:** PostgreSQL
* **ORM:** Prisma
* **Autenticación:** Auth.js (NextAuth)
* **Pagos:** Stripe (Checkout Sessions & Webhooks para manejo de stock)
* **Almacenamiento de Imágenes:** Cloudinary
* **Gráficos:** Recharts

---
🛡️ Seguridad de Arquitectura
Este proyecto fue construido priorizando la seguridad y la integridad de los datos:

Precios Validados en Servidor: Al realizar un pago, el frontend solo envía los IDs de los productos. El precio total se recalcula consultando a PostgreSQL mediante Prisma antes de crear la sesión de Stripe.

Transacciones ACID: El Webhook de Stripe utiliza transacciones de base de datos ($transaction) para asegurar que el pago y la deducción de inventario ocurran de forma simultánea, previniendo inconsistencias si algo falla.

Soft Deletes: Implementación de borrado lógico en modelos clave (como Productos y Categorías) para mantener intacto el historial de órdenes antiguas.

## 🚀 Requisitos Previos

Antes de clonar el proyecto, asegurate de tener instalado:
* Node.js (v18 o superior)
* pnpm (recomendado, el proyecto usa `pnpm-workspace`) o npm
* Una base de datos PostgreSQL activa

---
