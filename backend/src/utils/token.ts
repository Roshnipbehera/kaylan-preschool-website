import crypto from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { User } from "@prisma/client";

// The JWT `role` claim (and every REST response's `role` field) is kept
// LOWERCASE to match the frontend's `Role` type (lib/types/index.ts:
// "parent" | "teacher" | "admin") and middleware.ts's role-route map --
// only the Prisma/Postgres layer uses the uppercase UserRole enum.
export type JwtRole = "parent" | "teacher" | "admin";

export interface AccessTokenPayload {
  sub: string;
  role: JwtRole;
  email: string;
  name: string;
}

export function toJwtRole(role: User["role"]): JwtRole {
  return role.toLowerCase() as JwtRole;
}

export function signAccessToken(user: Pick<User, "id" | "role" | "email" | "name">): string {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"],
  };
  const payload: AccessTokenPayload = { sub: user.id, role: toJwtRole(user.role), email: user.email, name: user.name };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as AccessTokenPayload;
}

/**
 * Refresh tokens are opaque random strings (not JWTs). The RAW token is
 * given to the client as an httpOnly cookie; only its SHA-256 hash is
 * persisted (RefreshToken.tokenHash), so a leaked database never exposes a
 * usable token. This also makes revocation/rotation a simple row lookup.
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function refreshTokenExpiryDate(): Date {
  const days = parseDays(process.env.JWT_REFRESH_EXPIRES_IN ?? "30d");
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function parseDays(spec: string): number {
  const match = /^(\d+)d$/.exec(spec.trim());
  return match ? Number(match[1]) : 30;
}

export const ACCESS_COOKIE_NAME = "kaylan_access_token";
export const REFRESH_COOKIE_NAME = "kaylan_refresh_token";

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 15, // 15m, mirrors JWT_ACCESS_EXPIRES_IN default
  path: "/",
};

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30d, mirrors JWT_REFRESH_EXPIRES_IN default
  path: "/api/v1/auth",
};
