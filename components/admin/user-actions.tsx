"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleUserStatus, toggleUserRole } from "@/lib/actions/user.actions";

interface UserActionsProps {
  user: {
    id: string;
    role: string;
    isActive: boolean;
    email: string;
  };
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggleStatus() {
    if (
      !confirm(
        `¿${user.isActive ? "Desactivar" : "Activar"} al usuario ${user.email}?`,
      )
    )
      return;

    setLoading(true);
    const result = await toggleUserStatus(user.id, !user.isActive);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(user.isActive ? "Usuario desactivado" : "Usuario activado");
    router.refresh();
  }

  async function handleToggleRole() {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`¿Cambiar rol de ${user.email} a ${newRole}?`)) return;

    setLoading(true);
    const result = await toggleUserRole(user.id, newRole);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`Rol cambiado a ${newRole}`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleStatus}
        disabled={loading}
        className="text-xs px-2 py-1 rounded-lg border border-border hover:bg-neutral-100 transition disabled:opacity-50"
      >
        {user.isActive ? "Desactivar" : "Activar"}
      </button>
      <button
        onClick={handleToggleRole}
        disabled={loading}
        className="text-xs px-2 py-1 rounded-lg border border-border hover:bg-neutral-100 transition disabled:opacity-50"
      >
        {user.role === "ADMIN" ? "→ USER" : "→ ADMIN"}
      </button>
    </div>
  );
}
