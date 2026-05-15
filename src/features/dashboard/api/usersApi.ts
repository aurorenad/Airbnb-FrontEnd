import api from "../../../lib/axios";
import type { AuthUser, UserRole } from "../../auth/types";

export interface AdminUser extends AuthUser {
  _count?: {
    listings?: number;
  };
}

interface UsersResponse {
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchUsers = async () => {
  const { data } = await api.get<UsersResponse>("/users", {
    params: { limit: 100 },
  });
  return data;
};

export const updateUserRole = async (id: string, role: UserRole) => {
  const { data } = await api.put<AdminUser>(`/users/${id}`, { role });
  return data;
};

export const updateUserAdminAccess = async (id: string, role: UserRole, isSuperAdmin: boolean) => {
  const { data } = await api.put<AdminUser>(`/users/${id}`, { role, isSuperAdmin });
  return data;
};

export const createAdminUser = async (payload: {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  isSuperAdmin?: boolean;
}) => {
  const { data } = await api.post<AdminUser>("/users", { ...payload, role: "ADMIN" });
  return data;
};

export const updateUserProfile = async (id: string, payload: Partial<Pick<AuthUser, "name" | "email" | "phone" | "bio">>) => {
  const { data } = await api.put<AuthUser>(`/users/${id}`, payload);
  return data;
};

export const uploadAvatar = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post<AuthUser>(`/upload/users/${id}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
};
