"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export function ChangePasswordGuard() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    // Se está logado e precisa trocar senha, redireciona
    if (token && user && user.mustChangePassword) {
      // Permite estar na página de change-password
      if (typeof window !== "undefined" && window.location.pathname === "/change-password") {
        return;
      }

      // Redireciona para change-password
      router.push("/change-password");
    }
  }, [token, user, hasHydrated, router]);

  return null;
}
