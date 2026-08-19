import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { AppError } from "./errorHandler";

// Double-submit-cookie CSRF protection. The JWT auth cookies are httpOnly
// (so JS can't read/exfiltrate them), but that alone doesn't stop a
// cross-site form/fetch from riding the browser's cookie jar with
// sameSite=lax (which still allows simple top-level GETs and, in some
// browsers/edge cases, certain cross-site requests). This adds a second,
// independent check: a non-httpOnly token cookie that the frontend must
// read and echo back in a custom header on every state-changing request.
// A cross-site attacker can trigger the cookie to be sent automatically,
// but cannot read its value to put it in the header (same-origin policy),
// so the header+cookie can only match if the request actually originated
// from our own frontend JS.

export const CSRF_COOKIE_NAME = "kaylan_csrf_token";
export const CSRF_HEADER_NAME = "x-csrf-token";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Endpoints exempt from the header-must-match-cookie check. These are the
// pre-session auth endpoints: a brand-new browser has never received the
// CSRF cookie yet (it's only issued by this same middleware on a prior
// response), so requiring it here would make first-ever login impossible
// without an extra bootstrap GET. Login/register/refresh are password- or
// token-gated and already rate-limited (authRoutes.ts's authLimiter);
// "login CSRF" is a materially lower-severity issue than session-riding on
// an already-authenticated mutation, which is what this middleware exists
// to stop. Logout is intentionally NOT exempt.
const CSRF_EXEMPT_PATHS = new Set([
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
  // Public, unauthenticated admission-application submission -- a first-time
  // visitor has no prior response from this API to have received the CSRF
  // cookie from. Already covered by admissionRoutes.ts's rate limiter.
  "/api/v1/admissions",
]);

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const CSRF_COOKIE_OPTIONS = {
  httpOnly: false, // must be readable by frontend JS to echo back in the header
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/**
 * Ensures every response carries a CSRF cookie (issuing one if missing),
 * and rejects state-changing requests whose X-CSRF-Token header doesn't
 * match the cookie. Applied globally in app.ts, ahead of routes -- reads
 * (GET/HEAD/OPTIONS) and unauthenticated public endpoints are unaffected
 * since only the browser cookie/header pair is compared, not auth state.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  let cookieToken = req.cookies?.[CSRF_COOKIE_NAME] as string | undefined;
  if (!cookieToken) {
    cookieToken = generateCsrfToken();
    res.cookie(CSRF_COOKIE_NAME, cookieToken, CSRF_COOKIE_OPTIONS);
  }

  if (SAFE_METHODS.has(req.method) || CSRF_EXEMPT_PATHS.has(req.path)) {
    return next();
  }

  const headerToken = req.headers[CSRF_HEADER_NAME] as string | undefined;
  if (!headerToken || headerToken !== cookieToken) {
    throw new AppError("Invalid or missing CSRF token", 403);
  }

  next();
}
