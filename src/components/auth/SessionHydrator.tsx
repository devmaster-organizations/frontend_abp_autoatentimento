"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { ChangePasswordGuard } from "./ChangePasswordGuard";

export function SessionHydrator() {
  const router = useRouter();
  const hydrate = useAuthStore((state) => state.hydrate);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const handleRouteChange = () => {
      const token = useAuthStore.getState().token;
      const user = useAuthStore.getState().user;
      const hasHydrated = useAuthStore.getState().hasHydrated;

      if (!hasHydrated) return;

      if (
        token &&
        user &&
        user.mustChangePassword &&
        typeof window !== "undefined" &&
        window.location.pathname !== "/change-password"
      ) {
        router.push("/change-password");
      }
    };

    // Executa uma vez para proteger a rota raiz
    handleRouteChange();

    // Se houver mudança no estado de autenticação
    if (token && user && user.mustChangePassword) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      if (currentPath !== "/change-password" && currentPath !== "/login") {
        router.push("/change-password");
      }
    }
  }, [token, user, router]);

  return <ChangePasswordGuard />;
}
