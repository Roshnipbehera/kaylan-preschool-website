// MOCK auth API. Every export here has the exact signature/return shape a
// real implementation (calling apiFetch against the Express backend in
// /backend/src/routes/authRoutes.ts) would have. Swapping to the real
// backend later means replacing the body of each function with an
// apiFetch(...) call -- callers (lib/auth/AuthContext.tsx, forms) do not
// need to change.

import { mockDelay, USE_MOCK_API, apiFetch, ApiError } from "@/lib/api/client";
import type { Role, User } from "@/lib/types";

export interface LoginPayload {
  email: string;
  password: string;
  role: Role;
}

export interface LoginResult {
  user: User;
  token: string;
}

// --- in-memory mock "database" -------------------------------------------

const MOCK_USERS: Record<string, User & { password: string }> = {
  "parent@kaylan.school": {
    id: "u_parent_1",
    name: "Ananya Rao",
    email: "parent@kaylan.school",
    role: "parent",
    isEmailVerified: true,
    password: "password123",
    createdAt: "2024-01-10T00:00:00.000Z",
  },
  "teacher@kaylan.school": {
    id: "u_teacher_1",
    name: "Meera Iyer",
    email: "teacher@kaylan.school",
    role: "teacher",
    isEmailVerified: true,
    password: "password123",
    createdAt: "2023-06-01T00:00:00.000Z",
  },
  "admin@kaylan.school": {
    id: "u_admin_1",
    name: "Kaylan Admin",
    email: "admin@kaylan.school",
    role: "admin",
    isEmailVerified: true,
    password: "password123",
    createdAt: "2022-01-01T00:00:00.000Z",
  },
};

/**
 * MOCK -- produces a base64 JSON blob that LOOKS like a JWT payload but is
 * NOT signed/verified. Replace with the real signed JWT returned by
 * POST /api/v1/auth/login on the real backend (see backend/src/controllers/
 * authController.ts, which uses jsonwebtoken + JWT_SECRET).
 */
function createMockToken(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + 1000 * 60 * 60 * 24, // 24h
  };
  return `mock.${btoa(JSON.stringify(payload))}.token`;
}

/**
 * Decodes EITHER the mock token format above OR a real signed JWT from the
 * Express backend (base64url, 3 segments, `exp` in seconds not ms). Client
 * side this is a read-only decode for UI purposes -- the real backend is
 * the source of truth for verification, and middleware.ts independently
 * verifies the signature via `jose` before granting access to protected
 * routes.
 */
export function decodeMockToken(token: string): { sub: string; email: string; role: Role; name: string; exp: number } | null {
  try {
    const [, body] = token.split(".");
    const base64 = body.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    const expMs = USE_MOCK_API ? payload.exp : payload.exp * 1000; // real JWT `exp` is seconds since epoch
    if (!payload.exp || expMs < Date.now()) return null;
    return { ...payload, exp: expMs };
  } catch {
    return null;
  }
}

export async function refresh(): Promise<{ token: string }> {
  return apiFetch<{ token: string }>("/auth/refresh", { method: "POST" });
}

export async function logoutApi(): Promise<void> {
  if (!USE_MOCK_API) {
    await apiFetch("/auth/logout", { method: "POST" });
  }
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  if (!USE_MOCK_API) {
    // Real backend: POST /api/v1/auth/login (backend/src/controllers/authController.ts).
    // Sets httpOnly access + refresh cookies AND returns the access token in
    // the body for callers (AuthContext) that also keep it in
    // localStorage/`kaylan_session` for the Edge-runtime middleware to read.
    return apiFetch<LoginResult>("/auth/login", { method: "POST", json: payload });
  }

  await mockDelay();
  const record = MOCK_USERS[payload.email.toLowerCase()];
  if (!record || record.password !== payload.password || record.role !== payload.role) {
    throw new ApiError("Invalid email, password, or role.", 401);
  }
  const { password: _pw, ...user } = record;
  return { user, token: createMockToken(user) };
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  if (!USE_MOCK_API) {
    return apiFetch("/auth/forgot-password", { method: "POST", json: { email } });
  }
  await mockDelay(600);
  // A real backend emails a reset link via Nodemailer (see
  // backend/src/config/nodemailer.ts). Here we just log it for the demo.
  // eslint-disable-next-line no-console
  console.info(`[MOCK EMAIL] Password reset link sent to ${email}: /reset-password?token=mock-reset-token`);
  return { message: "If an account exists for that email, a reset link has been sent." };
}

export async function verifyEmail(token: string): Promise<{ verified: boolean }> {
  if (!USE_MOCK_API) {
    return apiFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  }
  await mockDelay(500);
  return { verified: token.length > 4 };
}

export async function me(token: string): Promise<User> {
  if (!USE_MOCK_API) {
    return apiFetch<User>("/auth/me");
  }
  await mockDelay(300);
  const decoded = decodeMockToken(token);
  if (!decoded) throw new ApiError("Session expired.", 401);
  const record = MOCK_USERS[decoded.email];
  if (!record) throw new ApiError("User not found.", 404);
  const { password: _pw, ...user } = record;
  return user;
}
