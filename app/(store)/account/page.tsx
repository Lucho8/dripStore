import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, User as UserIcon, Settings } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  return (
    <div style={{ maxWidth: "896px", margin: "0 auto", padding: "48px 16px" }}>
      <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>

      {/* Contenedor principal flex (simulando grid de 3 columnas) */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Columna Izquierda: Tarjeta de Información Personal (1/3 del ancho) */}
        <div
          className="bg-card"
          style={{
            flex: "1 1 250px",
            border: "1px solid #e5e5e5",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              className="text-primary"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserIcon size={32} />
            </div>
            <div>
              <h2 className="font-semibold text-lg">
                {user.name || "Usuario"}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div
            className="text-sm"
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #e5e5e5",
                paddingBottom: "8px",
              }}
            >
              <span className="text-muted-foreground">Miembro desde</span>
              <span className="font-medium">
                {new Date(user.createdAt).toLocaleDateString("es-AR")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #e5e5e5",
                paddingBottom: "8px",
              }}
            >
              <span className="text-muted-foreground">Rol</span>
              <span className="font-medium">{user.role}</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Menú de Accesos Rápidos (2/3 del ancho) */}
        <div
          style={{
            flex: "2 1 450px",
            display: "flex",
            gap: "16px",
            flexDirection: "column",
          }}
        >
          {/* Fila interna de 2 botones (simulando grid interno) */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {/* Ir a Mis Pedidos */}
            <Link
              href="/account/orders"
              className="bg-card group"
              style={{
                flex: "1 1 200px",
                border: "1px solid #e5e5e5",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                className="group-hover:text-primary transition-colors"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Package size={24} />
              </div>
              <div>
                <h3
                  className="font-semibold text-lg"
                  style={{ marginBottom: "4px" }}
                >
                  Mis Pedidos
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  Revisa el estado de tus compras, historial y envíos.
                </p>
              </div>
            </Link>

            {/* Configuración (Próximamente) */}
            <Link
              href="/account/settings"
              className="bg-card group"
              style={{
                flex: "1 1 200px",
                border: "1px solid #e5e5e5",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                className="group-hover:text-primary transition-colors"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Settings size={24} className="text-muted-foreground" />
              </div>
              <div>
                <h3
                  className="font-semibold text-lg"
                  style={{ marginBottom: "4px" }}
                >
                  Ajustes
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  Cambia tu contraseña y opciones.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
