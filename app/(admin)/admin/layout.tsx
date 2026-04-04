import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Store,
  Palette,
  Users,
} from "lucide-react";
import { Toaster } from "sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white flex flex-col shrink-0">
        <div
          style={{ padding: "24px" }}
          className="border-b border-neutral-800"
        >
          <h1 className="font-bold text-lg">DRIP STORE</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Panel de administración
          </p>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <Store size={18} />
            Ver tienda
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 bg-neutral-50 overflow-auto">{children}</main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/orders", label: "Órdenes", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categorías", icon: Tag },
  { href: "/admin/colors-sizes", label: "Colores y Talles", icon: Palette },
  { href: "/admin/users", label: "Usuarios", icon: Users },
];
