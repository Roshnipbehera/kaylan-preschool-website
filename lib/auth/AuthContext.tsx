"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi, decodeMockToken, me as meApi, logoutApi } from "@/lib/api/auth";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/cookies";
import type { Role, User } from "@/lib/types";
import { ApiError, USE_MOCK_API } from "@/lib/api/client";

const STORAGE_KEY = "kaylan_token";

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  login: (email: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!token) {
      setIsLoading(false);
      return;
    }
    const decoded = decodeMockToken(token);
    if (!decoded) {
      window.localStorage.removeItem(STORAGE_KEY);
      clearSessionCookie();
      setIsLoading(false);
      return;
    }
    meApi(token)
      .then(setUser)
      .catch(() => {
        window.localStorage.removeItem(STORAGE_KEY);
        clearSessionCookie();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string, role: Role) => {
    const { user: loggedInUser, token } = await loginApi({ email, password, role });
    window.localStorage.setItem(STORAGE_KEY, token);
    // Real backend ALSO sets its own httpOnly `kaylan_access_token` /
    // `kaylan_refresh_token` cookies on the response (see
    // backend/src/controllers/authController.ts). This client-set
    // `kaylan_session` cookie is what middleware.ts (Edge runtime, can't
    // read localStorage) actually inspects, so we keep setting it in both
    // mock and real modes -- it's a readable mirror of the access token,
    // not the security boundary (the httpOnly cookie + `requireAuth`
    // middleware on the Express backend is).
    setSessionCookie(token);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    clearSessionCookie();
    setUser(null);
    if (!USE_MOCK_API) {
      logoutApi().catch(() => {
        // best-effort: cookies are cleared client-side regardless
      });
    }
    router.push("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, role: user?.role ?? null, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new ApiError("useAuth must be used within AuthProvider", 500);
  return ctx;
}
