import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
// Fix: correct relative path from context/ to types.ts one level up
import type { AuthUser, UserRole } from "../types";
import { apiLogin, apiRegister, apiMe, type RegisterPayload } from "../api/authApi";
import { AuthContext } from "./AuthContextProvider";

const TOKEN_KEY = "auth_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<AuthUser | null>(null);
  // Fix: initialize loading as false, set it inside the async flow only
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // Restore session on mount (silent initialization - no loading state)
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    apiMe(token)
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY));
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
      // Fix: preserve caught error as cause
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      await apiRegister(payload);
      await login(payload.email, payload.password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      // Fix: preserve caught error as cause
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setError(null);
  };

  const role = (user?.role as UserRole) ?? null;

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      role,
      isHost:  role === "HOST",
      isAdmin: role === "ADMIN" || role === "SUPER_ADMIN",
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

// Re-export context from separate file to satisfy react-refresh
export { AuthContext, type AuthContextType } from "./AuthContextProvider";