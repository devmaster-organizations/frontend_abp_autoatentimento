import { apiRequest } from "./client";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SECRETARIA";
  createdAt: string;
  updatedAt: string;
};

export async function fetchUsers(token: string) {
  return apiRequest<ApiUser[]>("/users", { token });
}

export async function createUser(
  token: string,
  payload: { name: string; email: string; role: "ADMIN" | "SECRETARIA" },
) {
  return apiRequest<ApiUser & { temporaryPassword?: string; mustChangePassword?: boolean }>("/users", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateUser(
  token: string,
  userId: string,
  payload: { name: string; email: string; role: "ADMIN" | "SECRETARIA" },
) {
  return apiRequest<ApiUser>(`/users/${userId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function deleteUser(token: string, userId: string) {
  return apiRequest<void>(`/users/${userId}`, {
    method: "DELETE",
    token,
  });
}
