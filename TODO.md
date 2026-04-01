# TODO — Drip Store

## Tailwind v4

- [ ] Reemplazar todos los `style` inline por clases de Tailwind correctas
- [ ] Verificar que max-w funcione correctamente en el carrito

## Webhook Stripe

- [ ] Mejorar el webhook para guardar los OrderItems con variantId real
- [ ] Pasar los variantIds como metadata en createCheckoutSession
- [ ] Al procesar el webhook de Stripe exitoso, bajar el stock de cada variante comprada
- [ ] Evaluar si agregar página /checkout/cancelled para mejor UX

## Pendientes generales

- [ ] Dark mode
- [ ] Login con Google
- [ ] Panel de Admin completo
- [ ] Historial de compras del usuario en /account/orders
- [ ] Detalle de orden individual
- [ ] Al eliminar categoría, verificar que no tenga productos activos antes de hacer soft delete
- [ ] Arreglar conversión de precio en Stripe — actualmente divide por 1000, tiene que multiplicar por 100 directamente (los precios ya están en USD)
- [ ] Agregar búsqueda por texto en el catálogo de productos para clientes

## ADMIN

- [ ] Arreglar padding del admin dashboard con Tailwind correcto
- [ ] Arreglar badges de estado en tabla de productos con Tailwind correcto
- [ ] Alinear headers de tabla de productos a la izquierda
- [ ] Arreglar padding del sidebar header con Tailwind correcto
- [ ] Soporte para múltiples imágenes por producto con galería en el detalle
- [ ] Gestión de cupones de descuento
- [ ] Reportes de ventas con gráficos

## Cloudinary

-[ ] Implementar upload directo a Cloudinary desde el browser (sin pasar por Next.js server) para soportar imágenes grandes
