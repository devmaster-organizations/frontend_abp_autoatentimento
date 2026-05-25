"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { ChangePassword } from "@/components/ChangePassword";

export default function ChangePasswordPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    // Se não estiver logado, redireciona para login
    if (!token || !user) {
      router.push("/login");
      return;
    }

    // Se já trocou a senha, redireciona para o dashboard
    if (!user.mustChangePassword) {
      if (user.role === "ADMIN") {
        router.push("/admin");
        return;
      }

      if (user.role === "SECRETARIA") {
        router.push("/secretaria");
        return;
      }

      router.push("/");
    }
  }, [token, user, hasHydrated, router]);

  if (!hasHydrated || !token || !user) {
    return null;
  }

  if (!user.mustChangePassword) {
    return null;
  }

  return <ChangePassword />;
}
