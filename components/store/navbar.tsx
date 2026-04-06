import Link from "next/link";
import { auth } from "@/auth";
import { ShoppingBag, User, Heart } from "lucide-react";
import { CartCount } from "@/components/store/cart-count";
import { LogoutButton } from "@/components/auth/logout-button";

import { SearchBar } from "@/components/store/search-bar";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          DRIP STORE
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Productos
          </Link>
          <Link
            href="/products?category=remeras"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Remeras
          </Link>
          <Link
            href="/products?category=pantalones"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Pantalones
          </Link>
          <Link
            href="/products?category=accesorios"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Accesorios
          </Link>

          {session?.user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Admin
            </Link>
          )}

          <SearchBar />
        </nav>

        <div className="flex items-center gap-4">
          {session && (
            <Link
              href="/account/wishlist"
              className="text-muted-foreground hover:text-foreground transition relative flex items-center justify-center w-10 h-10 rounded-full"
            >
              <Heart size={22} />
            </Link>
          )}

          <CartCount />

          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <User size={22} />
                <span className="hidden md:block">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
