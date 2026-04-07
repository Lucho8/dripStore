"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function SocialLogin() {
  const handleGoogleLogin = () => {
    // Esto redirige a la pantalla de Google y luego vuelve a '/' (o donde le digas)
    signIn("google", { callbackUrl: "/account" });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span
            className="bg-background text-muted-foreground"
            style={{ padding: 5 }}
          >
            O si preferis
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={handleGoogleLogin}
      >
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google"
          width={16}
          height={16}
        />
        Continuar con Google
      </Button>
    </div>
  );
}
