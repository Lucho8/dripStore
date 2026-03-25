"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";

const LoginSchema = z.object({
  email: z.string().email("Email Invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

const RegisterSchema = z.object({
  name: z.string().min(2, "Minimo 2 caracteres"),
  email: z.string().email("Email Invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const parsed = LoginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email o contraseña incorrectos" };
    }
    return { error: "Algo salió mal" };
  }
}

export async function registerAction(values: z.infer<typeof RegisterSchema>) {
  const parsed = RegisterSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "El email ya está registrado" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: true };
}
