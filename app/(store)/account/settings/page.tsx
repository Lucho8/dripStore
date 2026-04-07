"use client";

import { useState } from "react";
import { ArrowLeft, User, Lock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  updateProfile,
  deactivateOwnAccount,
} from "@/lib/actions/user.actions";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [loadingDeactivate, setLoadingDeactivate] = useState(false);

  // Manejar cambio de perfil (Nombre y/o Contraseña)
  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);

    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Perfil actualizado correctamente");
      // Solución al error: usamos los IDs directamente del documento HTML
      const newPassInput = document.getElementById(
        "newPassword",
      ) as HTMLInputElement;
      const confirmPassInput = document.getElementById(
        "confirmPassword",
      ) as HTMLInputElement;
      if (newPassInput) newPassInput.value = "";
      if (confirmPassInput) confirmPassInput.value = "";
    }
  }

  // Manejar la desactivación de cuenta
  async function handleDeactivate() {
    const confirmed = confirm(
      "¿Estás seguro de que deseas desactivar tu cuenta? Dejarás de tener acceso a tu historial de compras.",
    );

    if (confirmed) {
      setLoadingDeactivate(true);
      const res = await deactivateOwnAccount();

      if (res.error) {
        toast.error(res.error);
        setLoadingDeactivate(false);
      } else {
        toast.success("Tu cuenta ha sido desactivada");
        // Cerramos sesión y lo mandamos al inicio
        await signOut({ callbackUrl: "/" });
      }
    }
  }

  return (
    <div style={{ maxWidth: "896px", margin: "0 auto", padding: "48px 16px" }}>
      {/* Botón Volver */}
      <Link
        href="/account"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          color: "#737373",
          textDecoration: "none",
          marginBottom: "32px",
          transition: "color 0.2s",
        }}
      >
        <ArrowLeft size={16} /> Volver a mi cuenta
      </Link>

      <h1
        style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "32px" }}
      >
        Ajustes de la Cuenta
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Sección: Información Personal y Contraseña */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e5e5",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <User size={20} color="#737373" /> Información Personal
          </h2>

          <form
            onSubmit={handleProfileSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              maxWidth: "400px",
            }}
          >
            {/* Campo: Nombre */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                htmlFor="name"
                style={{ fontSize: "14px", fontWeight: "500" }}
              >
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Tu nuevo nombre (opcional)"
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e5e5e5",
                  fontSize: "14px",
                  width: "100%",
                  outline: "none",
                }}
              />
            </div>

            <div
              style={{
                height: "1px",
                backgroundColor: "#e5e5e5",
                margin: "8px 0",
              }}
            />

            <h3
              style={{
                fontSize: "16px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "8px 0",
              }}
            >
              <Lock size={16} color="#737373" /> Cambiar Contraseña (Opcional)
            </h3>

            {/* Campo: Nueva Contraseña */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                htmlFor="newPassword"
                style={{ fontSize: "14px", fontWeight: "500" }}
              >
                Nueva contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Mínimo 6 caracteres"
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e5e5e5",
                  fontSize: "14px",
                  width: "100%",
                  outline: "none",
                }}
              />
            </div>

            {/* Campo: Confirmar Contraseña */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                htmlFor="confirmPassword"
                style={{ fontSize: "14px", fontWeight: "500" }}
              >
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repite la nueva contraseña"
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e5e5e5",
                  fontSize: "14px",
                  width: "100%",
                  outline: "none",
                }}
              />
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "16px",
                padding: "12px 24px",
                borderRadius: "8px",
                backgroundColor: "#171717",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>

        {/* Zona de Peligro: Desactivar Cuenta */}
        <div
          style={{
            backgroundColor: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#e11d48",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertTriangle size={20} /> Zona de Peligro
          </h2>
          <p
            style={{ fontSize: "14px", color: "#be123c", marginBottom: "24px" }}
          >
            Al desactivar tu cuenta, tu perfil ya no será visible y perderás
            acceso a tu historial de compras. Podrás reactivarla iniciando
            sesión nuevamente.
          </p>

          <button
            onClick={handleDeactivate}
            disabled={loadingDeactivate}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              backgroundColor: "#e11d48",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
              cursor: loadingDeactivate ? "not-allowed" : "pointer",
              opacity: loadingDeactivate ? 0.7 : 1,
            }}
          >
            {loadingDeactivate ? "Desactivando..." : "Desactivar mi cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}
