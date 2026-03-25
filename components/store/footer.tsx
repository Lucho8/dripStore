import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">DRIP STORE</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ropa urbana y streetwear para los que se animan a destacar.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Tienda</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/products"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Todos los productos
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=remeras"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Remeras
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=pantalones"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Pantalones
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=accesorios"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Accesorios
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Ayuda</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/faq"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link
                href="/shipping"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Envíos
              </Link>
            </li>
            <li>
              <Link
                href="/returns"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Devoluciones
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 Drip Store. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
