import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthUser, UserRole } from "../types";
import { apiLogin, apiRegister, apiMe, type RegisterPayload } from "../api/authApi";

const TOKEN_KEY = "auth_token";

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  isHost: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY));
  const [error, setError] = useState<string | null>(null);

  // Restore session on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    apiMe(token)
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const clearUser = () => setUser(null);
    window.addEventListener("auth-token-cleared", clearUser);
    return () => window.removeEventListener("auth-token-cleared", clearUser);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user: u } = await apiLogin(email, password);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(u);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      // Register then auto-login
      await apiRegister(payload);
      await login(payload.email, payload.password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      role: (user?.role as UserRole) ?? null,
      isHost: user?.role === "HOST",
      isAdmin: user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
      loading,
      error,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
