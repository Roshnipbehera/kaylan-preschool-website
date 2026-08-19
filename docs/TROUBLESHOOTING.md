# Troubleshooting

## `npx prisma generate` fails with a checksum/network error
```
Error: Failed to fetch sha256 checksum at https://binaries.prisma.sh/... - 403 Forbidden
```
Prisma needs to download platform-specific engine binaries the first time it generates a client. In a network-restricted environment (CI runner without egress, an offline sandbox, a corporate proxy blocking `binaries.prisma.sh`), this will always fail. Fixes: run `prisma generate` somewhere with internet access and commit/cache the generated client, use a Prisma-supported offline/vendored-engine setup, or (last resort) set `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` if you have the binaries cached locally already. This is an infrastructure constraint, not a schema or code defect — `npx prisma validate` (pure syntax/relation check, no network) should still pass and is the right command to confirm the schema itself is correct.

## `npm run build` (frontend) fails with a `next/font` Google Fonts error
```
Error [NextFontError]: Failed to fetch font `Baloo 2`.
URL: https://fonts.googleapis.com/css2?family=...
```
`app/layout.tsx` uses `next/font/google`, which fetches font CSS at build time. No internet access to `fonts.googleapis.com` means the build cannot complete. This is expected in offline/sandboxed build environments and is not a code defect — confirm `npx next lint` and `npx tsc --noEmit` are clean instead, which don't require network access, and run the real build somewhere with internet (any normal CI runner or dev machine has this by default).

## Docker healthcheck failing on the `backend` service
Check `DATABASE_URL` first — the backend's `/health` endpoint checks DB connectivity, so a wrong host/credentials/port will fail the healthcheck even though the container itself is "running". Confirm the `postgres` service's own healthcheck (`pg_isready`) is green before assuming the backend is broken. Inside `docker compose`, the host in `DATABASE_URL` must be the service name `postgres`, not `localhost`.

## Login fails / "Invalid credentials" for a demo account
Confirm you ran `npx prisma db seed` after migrating — the demo accounts (`parent@kaylan.school` / `teacher@kaylan.school` / `admin@kaylan.school`, all `password123`) only exist after seeding, they are not created by `migrate dev` alone.

## Login succeeds but every dashboard redirects to `/login` or `/403`
Almost always a `JWT_ACCESS_SECRET` mismatch between the frontend and backend `.env` files — `middleware.ts` verifies the backend-issued token independently on the Edge runtime and needs the exact same secret. Double-check both `.env` files have byte-for-byte identical values.

## `403 Invalid or missing CSRF token` on a mutating request
The frontend must read the `kaylan_csrf_token` cookie and echo it back in an `X-CSRF-Token` header on every non-GET request (see `docs/AUTHENTICATION.md`). If you're calling the API directly (Postman, curl, a custom script) rather than through the app's own `apiFetch` client, you need to do this manually: first make any GET request to receive the cookie, then read it and set the header on subsequent writes. A handful of pre-session endpoints (login/register/refresh/forgot-password/reset-password/admission-submission) are exempt.

## Backend tests fail with a Prisma-related TypeScript error
`npx tsc --noEmit` in `backend/` will show `Module '"@prisma/client"' has no exported member 'X'` errors whenever the Prisma client hasn't been generated (see the `prisma generate` entry above) — these are expected and documented, not a real bug, as long as they're limited to symbols that only exist after generation (`User`, `UserRole`, `NotificationType`, and the implicit-`any` callback-parameter errors that cascade from those missing types). `npm test` itself still passes because the test suite mocks the Prisma client directly rather than depending on the generated one.

## `docker compose up` hangs on `frontend` waiting for `backend`
The frontend's `depends_on: condition: service_healthy` blocks startup until the backend's `/health` check passes, which itself waits on `postgres`. If this hangs indefinitely, check `docker compose logs backend` for a migration or seed failure — a crashed `prisma migrate deploy` will prevent the backend from ever becoming healthy.

## General development gotchas discovered throughout this project
- `NEXT_PUBLIC_USE_MOCK_API` is a legacy flag with almost no remaining effect — don't assume flipping it changes behavior for most domains (see `docs/LOCAL_DEVELOPMENT.md`).
- The old `app/api/**` JSON route handlers and `data/**/*.json` files are intentionally left in the repo as inert dead code (migration artifacts) — do not delete them casually; several are still legitimately live (`downloads`, `progress`, `roles`, `health`, `upload-proxy`).
- The legacy Mongoose scaffold under `backend/src/models/` is dead code from the pre-Prisma architecture and is never connected to a database in the current configuration — do not set `MONGODB_URI` expecting it to do anything.
