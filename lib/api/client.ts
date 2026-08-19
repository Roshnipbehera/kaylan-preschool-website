// Typed fetch wrapper. In Phase 1 (NEXT_PUBLIC_USE_MOCK_API=true) the
// per-domain modules in lib/api/* never actually call this -- they use
// in-memory mock data with a simulated delay instead. This client exists
// so that flipping NEXT_PUBLIC_USE_MOCK_API to "false" and pointing
// NEXT_PUBLIC_API_URL at the real backend (see /backend) is the ONLY
// change needed: each mock function has the exact same signature/return
// shape as its real counterpart would have when built on top of this file.

import type { ApiResponse } from "@/lib/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions extends RequestInit {
  json?: unknown;
}

const CSRF_COOKIE_NAME = "kaylan_csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Reads the non-httpOnly CSRF cookie the backend's double-submit-cookie
 * middleware (backend/src/middleware/csrf.ts) sets on every response, so it
 * can be echoed back in a header on mutating requests. The httpOnly auth
 * cookies stay inaccessible to JS by design -- this cookie is intentionally
 * readable, that's the whole point of the pattern.
 */
function readCsrfCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Thin fetch wrapper used by the REAL backend integration path. Not called
 * during Phase 1's mock flow but kept fully functional so wiring the real
 * backend later is a drop-in swap inside lib/api/auth.ts, lib/api/user.ts,
 * lib/api/upload.ts.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;
  const method = (rest.method ?? "GET").toUpperCase();

  const csrfHeaders: Record<string, string> = {};
  if (!SAFE_METHODS.has(method)) {
    const csrfToken = readCsrfCookie();
    if (csrfToken) csrfHeaders[CSRF_HEADER_NAME] = csrfToken;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      credentials: "include", // real backend sets an httpOnly cookie
      headers: {
        "Content-Type": "application/json",
        ...csrfHeaders,
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });

    const payload = (await res.json().catch(() => null)) as ApiResponse<T> | null;

    if (!res.ok || !payload || payload.success === false) {
      throw new ApiError(payload?.message ?? res.statusText ?? "Request failed", res.status);
    }

    return payload.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err instanceof Error ? err.message : "Network error", 0);
  }
}

/** Simulated network latency for mock API calls. */
export function mockDelay(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
