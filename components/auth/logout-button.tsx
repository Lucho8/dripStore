"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"; //

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{ cursor: "pointer" }}
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      title="Cerrar sesión"
    >
      <LogOut size={20} />
    </Button>
  );
}
