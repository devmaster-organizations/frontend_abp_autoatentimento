import { apiRequest } from "./client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SECRETARIA";
  mustChangePassword: boolean;
};

export type LoginResponse = {
  token: string;
  expiresIn: string;
  user: AuthUser;
};

export async function login(email: string, password: string) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function forgotPassword(email: string) {
  return apiRequest<{ message: string; expiresAt?: string }>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return apiRequest<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: { token, newPassword },
  });
}

export async function changePassword(token: string, currentPassword: string, newPassword: string) {
  const response = await apiRequest<{ message: string; user: AuthUser }>("/auth/change-password", {
    method: "POST",
    token,
    body: { currentPassword, newPassword },
  });
  return response;
}
