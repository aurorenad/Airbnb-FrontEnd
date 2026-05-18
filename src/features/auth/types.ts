export type UserRole = "GUEST" | "HOST" | "ADMIN" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  role: UserRole;
  avatar?: string | null;
  bio?: string | null;
  isSuperAdmin?: boolean;
  createdAt?: string;
}