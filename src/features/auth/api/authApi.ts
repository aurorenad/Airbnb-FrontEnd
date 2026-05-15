import type { AuthUser } from "../types";

const BASE = `${import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1"}/auth`;

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export interface RegisterPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Login failed");
    return data as LoginResponse;
}

export async function apiRegister(payload: RegisterPayload): Promise<AuthUser> {
    // Auto-generate a unique username from email prefix
    const baseUsername = payload.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    const username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;

    const res = await fetch(`${BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, username, role: "GUEST" }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Registration failed");
    return data as AuthUser;
}

export async function apiMe(token: string): Promise<AuthUser> {
    const res = await fetch(`${BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Unauthorized");
    return data as AuthUser;
}
