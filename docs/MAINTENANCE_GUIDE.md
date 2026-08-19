# Maintenance Guide

Ongoing operational tasks for whoever administers the Kaylan Preschool platform after launch (developer or technically-comfortable staff member).

## Routine checks

- **Health check**: `GET /health` on the backend (see `backend/src/app.ts`) pings the database with a 2-second timeout. Set up an uptime monitor (UptimeRobot, a platform-native health check, etc.) against this endpoint so you're alerted if the backend or database goes down.
- **Audit log review**: `/admin` → audit logs (backed by the `AuditLog` Prisma model, written via `backend/src/lib/audit.ts`'s `logAudit()` from every mutating controller) — periodically review for unexpected admin actions (role changes, settings edits, deletions).
- **Disk/storage**: uploaded attachments and avatars are stored in Cloudinary, not on the application server, so the app servers themselves should stay effectively stateless. The only durable local state is the Postgres database.

## Dependency updates

- Backend (`backend/package.json`) and frontend (`package.json`) dependencies should be reviewed and updated periodically (e.g. quarterly), especially:
  - `next`, `react`, `express`, `prisma`/`@prisma/client` (keep these two in lockstep — mismatched versions can break the generated client).
  - `jsonwebtoken` / `jose` and `bcrypt`/`bcryptjs` (auth-critical).
  - `zod` (validation-critical).
- After any dependency bump: run `npm ci` fresh (do not patch an existing `node_modules` in place), then `npx tsc --noEmit`, `npm run lint`, `npm run build` (frontend) and the backend equivalents, before deploying.
- Known environment issue to watch for: the sandbox/dev environment this project was built and reviewed in has intermittently hit `npm install` `ENOTEMPTY` races and a corrupted `node_modules/csstype` declaration file that breaks `tsc`. Both are resolved by a clean `rm -rf node_modules && npm ci` on a real filesystem/CI runner — they are not defects in this project's own source code.

## Database maintenance

- **Migrations**: any future schema change to `backend/prisma/schema.prisma` should be shipped as a Prisma migration (`npx prisma migrate dev --name <description>` locally, committed, then `npx prisma migrate deploy` in production) — never hand-edit the production schema.
- **Backups**: see `docs/BACKUP_RESTORE.md`.
- **Seed data**: `backend/prisma/seed.ts` is meant for first-time setup / demo data only. Do not re-run it against a production database with real user data — it is not designed to be idempotent against live records.

## Rotating secrets

- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: rotating either invalidates all existing sessions (users will need to log in again). If rotating `JWT_ACCESS_SECRET`, update it in **both** the backend `.env` and the frontend `.env` at the same time (the frontend's Edge middleware verifies tokens locally with this value — see `docs/ENVIRONMENT_VARIABLES.md`).
- Cloudinary / SMTP credentials: rotate independently in their respective dashboards, then update `backend/.env` and redeploy the backend.

## Content vs. code changes

- Day-to-day content changes (marketing copy, contact details, social links, announcements, blog posts, gallery albums, events) should always go through `/admin` — see `docs/guides/ADMIN_GUIDE.md` and `docs/CMS_USER_GUIDE.md`. No code deploy is needed for these.
- Only structural changes (new pages, new fields, new roles/permissions, schema changes) require a code change and redeploy.

## Known limitations to keep in mind operationally

- There is no dedicated password-reset-via-email flow verified end-to-end in this pass beyond what's described in `docs/AUTHENTICATION.md` — confirm your SMTP credentials work in production before relying on it for real parents/teachers.
- `Role` / `Permission` Prisma models exist but are not wired to any live authorization check — the real access control today is the fixed `PARENT` / `TEACHER` / `ADMIN` enum on `User`. Do not expect `/admin/roles` to change actual permissions; it is informational only.
- `components/Contact.tsx`'s enquiry form does not currently submit anywhere (no `onSubmit`/action wired) — this is a known limitation, not a maintenance task; see `FINAL_ACCEPTANCE_REPORT.md` section 3.
