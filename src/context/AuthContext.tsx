import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  // adicione campos do seu backend se houver (roles, etc.)
};

type AuthPayload = { token: string; user: AuthUser };

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (payload: AuthPayload, remember?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // hidrata do storage
  useEffect(() => {
    const raw = localStorage.getItem("auth") ?? sessionStorage.getItem("auth");
    if (raw) {
      try {
        const parsed: AuthPayload = JSON.parse(raw);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {}
    }
  }, []);

  const login = (payload: AuthPayload, remember = true) => {
    setUser(payload.user);
    setToken(payload.token);
    const str = JSON.stringify(payload);
    if (remember) localStorage.setItem("auth", str);
    else sessionStorage.setItem("auth", str);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
