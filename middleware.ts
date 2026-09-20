import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Two modes, selected by NEXT_PUBLIC_USE_MOCK_API (inlined at build time,
// readable here since middleware runs server-side/Edge, not in the
// browser bundle):
//
// - MOCK (default): reads the unsigned base64 "mock JWT" cookie set
//   client-side by lib/auth/cookies.ts on login (lib/auth/AuthContext.tsx).
// - REAL: verifies the actual signed JWT issued by the Express backend
//   (backend/src/utils/token.ts, signAccessToken) using `jose`
//   (Edge-runtime compatible, unlike `jsonwebtoken`). The real backend ALSO
//   sets its own httpOnly `kaylan_access_token` cookie, but this
//   middleware reads the same `kaylan_session` mirror cookie in both
//   modes so the rest of this file doesn't need an if/else on cookie name.

const SESSION_COOKIE_NAME = "kaylan_session";
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";
// Must match backend/.env's JWT_ACCESS_SECRET exactly in REAL mode.
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "";

const ROLE_ROUTES: Record<string, string> = {
  "/parent": "parent",
  "/teacher": "teacher",
  "/admin": "admin",
};

const PROTECTED_PREFIXES = ["/parent", "/teacher", "/admin", "/profile", "/settings"];

function decodeMockToken(token: string): { role?: string; exp?: number } | null {
  try {
    const cleanToken = decodeURIComponent(token);
    const [, body] = cleanToken.split(".");
    if (!body) return null;
    const base64 = body.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

async function decodeRealToken(token: string): Promise<{ role?: string; exp?: number } | null> {
  try {
    const cleanToken = decodeURIComponent(token);
    if (!JWT_ACCESS_SECRET) return null;
    const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
    const { payload } = await jwtVerify(cleanToken, secret);
    // jose validates `exp` itself (throws if expired) and exp is in seconds;
    // normalize to ms so downstream comparisons match the mock-mode shape.
    return { role: payload.role as string | undefined, exp: (payload.exp ?? 0) * 1000 };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const rawToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  let decoded: { role?: string; exp?: number } | null = null;

  if (rawToken) {
    if (rawToken.startsWith("mock.") || rawToken.startsWith("mock%2E") || USE_MOCK_API) {
      decoded = decodeMockToken(rawToken) || (await decodeRealToken(rawToken));
    } else {
      decoded = (await decodeRealToken(rawToken)) || decodeMockToken(rawToken);
    }
  }

  if (!decoded || (decoded.exp && decoded.exp < Date.now())) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = Object.entries(ROLE_ROUTES).find(([prefix]) => pathname.startsWith(prefix))?.[1];
  if (requiredRole && decoded.role !== requiredRole) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent/:path*", "/teacher/:path*", "/admin/:path*", "/profile/:path*", "/settings/:path*"],
};
