import { create } from "zustand";
import { login as loginRequest } from "@/services/api/auth.service";
import type { AuthUser } from "@/services/api/auth.service";

const AUTH_STORAGE_KEY = "fatec-auth";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  hydrate: () => void;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
};

type PersistedAuthPayload = {
  token: string;
  user: AuthUser;
};

const saveAuth = (payload: PersistedAuthPayload) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

const clearAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

const readAuth = (): PersistedAuthPayload | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedAuthPayload;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasHydrated: false,
  hydrate: () => {
    const persisted = readAuth();

    if (!persisted) {
      set({ hasHydrated: true });
      return;
    }

    set({
      token: persisted.token,
      user: persisted.user,
      isAuthenticated: true,
      hasHydrated: true,
    });
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      const response = await loginRequest(email, password);
      saveAuth({ token: response.token, user: response.user });

      set({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        hasHydrated: true,
      });

      return response.user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: () => {
    clearAuth();
    set({ token: null, user: null, isAuthenticated: false, hasHydrated: true });
  },
  updateUser: (updatedUser: AuthUser) => {
    set((state) => {
      if (state.token) {
        saveAuth({ token: state.token, user: updatedUser });
      }
      return { user: updatedUser };
    });
  },
}));
