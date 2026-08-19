# Authentication & Authorization

## Overview
JWT-based auth with short-lived access tokens + rotating refresh tokens, httpOnly cookies, role-based access control (RBAC), and double-submit-cookie CSRF protection. Implemented in `backend/src/controllers/authController.ts`, `backend/src/middleware/auth.ts`, `backend/src/utils/token.ts`, `backend/src/middleware/csrf.ts`, and enforced on the frontend by `middleware.ts`.

## Sequence of events

1. **Register/Login** (`POST /api/v1/auth/register` or `/login`) — backend verifies credentials (bcrypt hash comparison), issues an access token (JWT, short TTL, default 15m) and a refresh token (long TTL, default 30d, stored hashed in the `RefreshToken` table). Both are set as httpOnly cookies on the response (not returned in the JSON body), so frontend JS never touches the raw token values.
2. **Using the access token** — every subsequent authenticated request automatically carries the access-token cookie. `requireAuth` middleware (`backend/src/middleware/auth.ts`) reads it from `req.cookies` (falling back to an `Authorization: Bearer` header for non-browser clients), verifies it with `verifyAccessToken`, and attaches the decoded payload to `req.user`.
3. **Route protection (Edge)** — `middleware.ts` at the frontend runs on every request to a `(dashboard)` route. It independently verifies the same access-token cookie using `jose` (a pure-JS JWT library that works on the Edge runtime) and the shared `JWT_ACCESS_SECRET` — no network round-trip to the backend is needed to decide whether to redirect an unauthenticated visitor to `/login` or a wrong-role visitor to `/403`.
4. **Access token expiry** — once the access token expires, backend requests start returning 401. The frontend's API client calls `POST /api/v1/auth/refresh`, which reads the refresh-token cookie, validates it against the hashed value in `RefreshToken`, **rotates** it (issues a new refresh token, revokes the old one — `revokedAt` is set, so a stolen/replayed old refresh token is immediately rejected), and issues a fresh access token. Both new cookies are set on the response.
5. **Logout** (`POST /api/v1/auth/logout`) — revokes the current refresh token server-side and clears both cookies.
6. **Forgot/reset password** — `forgotPassword` generates a random reset token, emails a link (Nodemailer/SMTP); `resetPassword` validates the token + expiry and updates `passwordHash`.
7. **Email verification** — `verifyEmail` consumes a token issued at registration and flips `isEmailVerified`.

## RBAC
Three roles: `PARENT`, `TEACHER`, `ADMIN` (`UserRole` enum on `User`). Backend enforcement is two-layered:
- `requireAuth` — must have a valid access token.
- `requireRole(...roles)` — `req.user.role` must be in the allowed set (403 otherwise).

Additional row-level scoping happens inside individual controllers (e.g. a parent can only read/update their own children's `Student` records; a teacher only their assigned class) — this is finer-grained than route-level RBAC and documented per-route in `docs/API.md` and inline in the controllers.

## CSRF protection (double-submit cookie)
See `backend/src/middleware/csrf.ts` (extensively commented in the source). Summary: because the JWT cookies are httpOnly, a second **non-httpOnly** cookie (`kaylan_csrf_token`) is issued and must be echoed back by the frontend in an `X-CSRF-Token` header on every state-changing (non-GET/HEAD/OPTIONS) request. A cross-site attacker's browser will auto-send the cookie but cannot read its value (same-origin policy) to also set the header, so the check only passes for genuine same-origin requests. A small allowlist of pre-session endpoints (`login`, `register`, `refresh`, `forgot-password`, `reset-password`, public `admissions` submission) is exempt because a brand-new browser hasn't received the CSRF cookie yet; these are separately rate-limited instead.

## middleware.ts's role (frontend)
- Runs on every request matching the configured matcher (dashboard routes: `/parent`, `/teacher`, `/admin`, `/profile`, `/settings`).
- No token → redirect to `/login`.
- Valid token but wrong role for the requested section → redirect to `/403`.
- Valid token and matching role → request proceeds to the page.
- Runs entirely on the Edge runtime, so it cannot read `localStorage`; all decisions are made from the httpOnly-cookie-carried JWT verified via `jose`.
