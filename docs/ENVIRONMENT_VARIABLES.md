# Environment Variables Reference

Cross-checked against actual `process.env.` usage in the codebase (frontend `.env.example`, `lib/api/client.ts`, `middleware.ts`, and backend `.env.example` / `backend/src/**`).

## Frontend (`/.env.local`, see `.env.example`)

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NODE_ENV` | No (set by Next.js tooling) | `development` | Gates error-detail verbosity and dev-only warnings. `next build`/`next start` set it automatically; only set manually for custom Docker runners. |
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | `http://localhost:3000` | Canonical origin used by `app/sitemap.ts` and `app/robots.ts` to build absolute URLs. |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:4000/api/v1` | Base URL of the real Express backend. Used by `lib/api/client.ts`'s `apiFetch` for all live (Postgres-backed) domains. |
| `NEXT_PUBLIC_USE_MOCK_API` | No | `true` | Legacy flag from the Phase 1 scaffold. Most domains (auth, messaging, students, attendance, homework, fees, users, audit, settings, cms, admissions, blog, gallery, events, activities, announcements, notifications, analytics) have since been migrated to call the live backend directly via `apiFetch` regardless of this flag — see `docs/API.md`. Only a small number of legacy call-sites (`lib/api/downloads.ts`, `lib/api/progress.ts`, `lib/api/roles.ts`) still hit this Next.js app's own `app/api/**` JSON-file routes, which are unaffected by this flag either way. Kept for backward compatibility; safe to leave at its default. |
| `JWT_ACCESS_SECRET` | Yes (must match backend) | — | Must be byte-for-byte identical to `backend/.env`'s `JWT_ACCESS_SECRET`. `middleware.ts` verifies the backend-issued access token on the Edge runtime via `jose`, without a round-trip to the backend. |
| `NEXT_PUBLIC_SOCKET_URL` | Yes (for live messaging) | `http://localhost:4000` | Socket.io server URL; Socket.io attaches directly to the Express HTTP server (`backend/src/socket/index.ts`). Used by `lib/socket/client.ts`. |

## Backend (`/backend/.env`, see `backend/.env.example`)

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PORT` | No | `4000` | Port the Express server listens on. |
| `NODE_ENV` | Yes (production) | `development` | Gates error-response detail (`errorHandler.ts` strips stack traces in production), structured JSON logging vs. pretty dev logs (`config/logger.ts`), and cookie `secure`/`sameSite` defaults. |
| `CLIENT_URL` | Yes | `http://localhost:3000` | CORS allow-origin and links embedded in transactional emails. |
| `DATABASE_URL` | Yes | — | Postgres connection string. Every live domain lives here (see `backend/prisma/schema.prisma`). Server fails fast without a reachable value. In `docker-compose.yml` this is wired to the `postgres` service automatically. |
| `LOG_LEVEL` | No | `info` (prod) / `debug` (dev) | pino log level: `fatal`, `error`, `warn`, `info`, `debug`, `trace`. |
| `JWT_ACCESS_SECRET` | Yes | — | Signs/verifies short-lived access tokens. Must match the frontend's value. |
| `JWT_REFRESH_SECRET` | Yes | — | Signs/verifies long-lived refresh tokens (different secret from access, by design). |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token TTL. |
| `JWT_REFRESH_EXPIRES_IN` | No | `30d` | Refresh token TTL. |
| `CLOUDINARY_CLOUD_NAME` | Yes (for uploads) | — | Cloudinary account cloud name for avatar/attachment uploads. |
| `CLOUDINARY_API_KEY` | Yes (for uploads) | — | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes (for uploads) | — | Cloudinary API secret. |
| `SMTP_HOST` | Yes (for email) | — | Nodemailer SMTP host (verification/reset emails). |
| `SMTP_PORT` | No | `587` | SMTP port. |
| `SMTP_USER` | Yes (for email) | — | SMTP auth user. |
| `SMTP_PASS` | Yes (for email) | — | SMTP auth password. |
| `SMTP_FROM` | No | `"Kaylan Preschool <no-reply@kaylanpreschool.com>"` | From-address for outgoing mail. |
| `MAX_UPLOAD_BYTES` | No | `10485760` (10 MB) | Enforced by multer and message-attachment validation. |

**Removed/deprecated:** `MONGODB_URI` was removed. The pre-Postgres Mongoose scaffold (`backend/src/models/{Admission,Event,Rsvp}.ts`) is dead code — it type-checks but nothing connects to a Mongo database in this configuration. Do not re-add this variable.

**Note on `NEXT_PUBLIC_USE_MOCK_API`:** despite the name, this flag no longer toggles "mock vs real" for most of the app — the migration to the live Express/Prisma backend has already happened for the vast majority of domains at the `lib/api/*.ts` client level (each such file talks to the backend unconditionally via `apiFetch`). It is effectively a legacy no-op for those files; only `downloads`, `progress`, and `roles` clients still call this Next.js app's own JSON-file-backed `app/api/**` routes (unrelated to this flag).
