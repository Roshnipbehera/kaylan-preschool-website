// Small client-side cookie helpers used by the MOCK auth flow so that both
// the browser (localStorage-based useAuth hook) and Next.js middleware
// (edge runtime, cannot read localStorage) agree on the same session
// token. PRODUCTION NOTE: a real backend should set an httpOnly,
// Secure, SameSite=strict cookie itself on login/refresh -- client-set
// cookies like this are only acceptable for this Phase 1 mock.

const COOKIE_NAME = "kaylan_session";

export function setSessionCookie(token: string, maxAgeSeconds = 60 * 60 * 24) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
