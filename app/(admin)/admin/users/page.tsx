import { db } from "@/lib/db";
import { UserActions } from "@/components/admin/user-actions";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  return (
    <div style={{ padding: "32px" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {users.length} usuarios registrados
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Usuario
              </th>
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Rol
              </th>
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Órdenes
              </th>
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Registro
              </th>
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Estado
              </th>
              <th
                className="text-sm font-medium text-muted-foreground"
                style={{ padding: "12px 16px", textAlign: "left" }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border last:border-0 hover:bg-neutral-50 transition"
              >
                <td style={{ padding: "12px 16px" }}>
                  <div>
                    <p className="text-sm font-medium">
                      {user.name ?? "Sin nombre"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      backgroundColor:
                        user.role === "ADMIN" ? "#dbeafe" : "#f5f5f5",
                      color: user.role === "ADMIN" ? "#1d4ed8" : "#737373",
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className="text-sm text-muted-foreground">
                    {user._count.orders} órdenes
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      backgroundColor: user.isActive ? "#dcfce7" : "#f5f5f5",
                      color: user.isActive ? "#15803d" : "#737373",
                    }}
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <UserActions
                    user={{
                      id: user.id,
                      role: user.role,
                      isActive: user.isActive,
                      email: user.email ?? "",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
