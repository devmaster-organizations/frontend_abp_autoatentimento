"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthUser } from "@/services/api/auth.service";

type Role = AuthUser["role"];

type UseProtectedRouteParams = {
  allowedRoles?: Role[];
};

const getDefaultRouteByRole = (role: Role) =>
  role === "ADMIN" ? "/admin" : "/secretaria";

export function useProtectedRoute(params?: UseProtectedRouteParams) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const isAllowed = useMemo(() => {
    if (!token || !user) {
      return false;
    }

    if (!params?.allowedRoles || params.allowedRoles.length === 0) {
      return true;
    }

    return params.allowedRoles.includes(user.role);
  }, [params?.allowedRoles, token, user]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (!isAllowed) {
      router.replace(getDefaultRouteByRole(user.role));
    }
  }, [hasHydrated, isAllowed, router, token, user]);

  const isCheckingAccess = !hasHydrated || !token || !user || !isAllowed;

  return {
    token,
    user,
    isAllowed,
    isCheckingAccess,
  };
}
