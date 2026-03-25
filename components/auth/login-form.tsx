"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginAction } from "@/lib/actions/auth.actions";

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginValues = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginValues>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    
    const parsed = LoginSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<LoginValues> = {};
      const issues = parsed.error.issues;
      issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginValues;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const result = await loginAction(values);
    setLoading(false);

    if (result?.error) {
      setServerError(result.error);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Bienvenido de vuelta
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Ingresá su email y contraseña para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿No tenés cuenta?{" "}
        <a
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Registrate
        </a>
      </p>
    </div>
  );
}
