"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "aguaser-admin-auth";

type AdminAuthContextValue = {
  ready: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem(AUTH_KEY) === "1");
    setReady(true);
  }, []);

  const login = async () => {
    await fetch("/api/admin/session", { method: "POST" });
    sessionStorage.setItem(AUTH_KEY, "1");
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{ ready, isAuthenticated, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}

/** Protege rutas del panel: si no hay sesión mock, manda a login. */
export function AdminAuthGate({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [ready, isAuthenticated, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f4f8fb] text-sm text-neutral">
        Cargando panel…
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return children;
}
