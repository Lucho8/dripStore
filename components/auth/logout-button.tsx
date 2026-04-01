"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-muted-foreground hover:text-destructive transition flex items-center cursor-pointer"
      title="Cerrar sesión"
    >
      <LogOut size={20} />
    </button>
  );
}
