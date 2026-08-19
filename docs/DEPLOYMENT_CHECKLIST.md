# Deployment Checklist

A step-by-step checklist for taking Kaylan Preschool live. See `docs/DEPLOYMENT.md` for the detailed build/deploy commands this checklist references, and `docs/ENVIRONMENT_VARIABLES.md` for the full variable reference.

## Before you deploy

- [ ] Provision a real PostgreSQL database (managed service or your own server) and copy its connection string into `DATABASE_URL`.
- [ ] Generate two long random strings for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (backend `.env`). Copy the **same** `JWT_ACCESS_SECRET` value into the frontend `.env` as well — the frontend verifies tokens locally and must use an identical secret.
- [ ] Set `NODE_ENV=production` on both the frontend and backend.
- [ ] Set `CLIENT_URL` (backend) to the real frontend domain (e.g. `https://kaylanpreschool.school`) — this controls CORS.
- [ ] Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` (frontend) to the real backend domain.
- [ ] Set `NEXT_PUBLIC_SITE_URL` (frontend) to the real production origin — used for the sitemap and robots.txt.
- [ ] Create a real Cloudinary account and fill in `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` (used for message attachments and other uploads).
- [ ] Create a real SMTP account (or use a provider like SendGrid/Mailgun's SMTP relay) and fill in `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` — used for verification/reset emails.
- [ ] Double-check `.env.example` and `backend/.env.example` — they must never contain real secrets, only placeholders (confirmed clean at time of writing).
- [ ] Confirm `NEXT_PUBLIC_USE_MOCK_API` is not relied upon — most domains talk to the live backend regardless of this flag (see `docs/ENVIRONMENT_VARIABLES.md`).

## Database

- [ ] Run `cd backend && npx prisma validate` — confirms the schema is syntactically valid (does not require a DB connection).
- [ ] Run `npx prisma migrate deploy` against the production database (non-interactive; safe for CI/CD). **Do not** use `prisma migrate dev` in production.
- [ ] Note: this repository does not currently contain a `backend/prisma/migrations/` directory — before the first production deploy, generate an initial migration from `backend/prisma/schema.prisma` against a real database (`npx prisma migrate dev --name init` in a local/dev environment with network + DB access), commit the generated migration files, and only then run `migrate deploy` in production.
- [ ] Decide whether to run the seed script (`npx prisma db seed`) — useful for a first deploy to get an admin login and demo data, but drop it once real data exists (the `docker-compose.yml` backend command already runs migrate + seed automatically on every start; remove the seed step once in production).

## Build

- [ ] Backend: `cd backend && npm ci && npx prisma generate && npm run build` (compiles to `dist/`). `prisma generate` requires outbound network access to `binaries.prisma.sh`.
- [ ] Frontend: `npm ci && npm run build` (produces `.next/standalone` — `next.config.js` has `output: "standalone"`). Requires outbound network access to `fonts.googleapis.com` for `next/font`.
- [ ] Run `npx tsc --noEmit` and `npm run lint` in a clean environment (fresh `npm ci`, not a reused/corrupted `node_modules`) and confirm both are clean before shipping.

## Runtime

- [ ] Start backend: `node dist/server.js` (or `npm start`).
- [ ] Start frontend: `node .next/standalone/server.js`, with `public/` and `.next/static` copied alongside it (the Dockerfile already does this).
- [ ] Confirm the backend health-check endpoint responds: `GET /health` (see `backend/src/app.ts`) — it pings the database with a 2s timeout and returns a non-200 status if the DB is unreachable. Point your uptime monitor / load balancer health check at this route.
- [ ] Confirm Socket.io connects from the deployed frontend to the deployed backend (messaging depends on this — see `docs/MESSAGING.md`).

## Post-deploy smoke test

- [ ] Load the public homepage and confirm Contact section / Footer show the real address/phone/email (from `GET /api/v1/settings/public`, editable at `/admin/settings`), not the seed defaults.
- [ ] Log in as an admin, teacher, and parent test account and confirm each dashboard loads.
- [ ] Submit a test admissions application and confirm it appears in `/admin/admissions`.
- [ ] Send a test message between two accounts and confirm real-time delivery (Socket.io).
- [ ] Edit one CMS section in `/admin/cms` and confirm the change appears on the live marketing page.

## Docker path (if using `docker-compose.yml`)

- [ ] Confirm `docker-compose.yml` and both `Dockerfile`s build successfully in your target environment (`docker compose build`).
- [ ] Confirm the `postgres` service's volume is backed by durable storage (not an ephemeral container filesystem) before going live — see `docs/BACKUP_RESTORE.md`.
