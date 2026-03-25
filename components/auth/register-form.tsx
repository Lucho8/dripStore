"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { registerAction } from "@/lib/actions/auth.actions";

const RegisterSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type RegisterValues = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterValues>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterValues>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = RegisterSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<RegisterValues> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterValues;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const result = await registerAction(values);
    setLoading(false);

    if (result?.error) {
      setServerError(result.error);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Completá los datos para registrarte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
          />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
          />
          {errors.password && (
            <p className="text-destructive text-xs">{errors.password}</p>
          )}
        </div>

        {serverError && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿Ya tenés cuenta?{" "}
        <a href="/login" className="text-primary font-medium hover:underline">
          Iniciá sesión
        </a>
      </p>
    </div>
  );
}
