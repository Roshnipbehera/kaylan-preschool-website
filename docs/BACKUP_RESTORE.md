# Backup & Restore

All persistent application state lives in a single PostgreSQL database (see `docs/DATABASE.md` for the schema). File uploads (avatars, message attachments) are stored in Cloudinary, not on the application servers or in Postgres, so Cloudinary's own retention/backup applies to them separately — this guide covers the database only.

## What needs backing up

- The Postgres database pointed to by `DATABASE_URL` — this holds every domain: users, students, messages, attendance, homework, admissions, fees, CMS content, settings, audit logs, everything.
- Nothing else is stateful on the application side: the backend (`backend/dist`) and frontend (`.next/standalone`) are both stateless compiled artifacts that can be rebuilt from source at any time.

## Backing up

**Managed Postgres (RDS, Neon, Supabase, Railway, Render, etc.)**
Use the provider's built-in automated backup/snapshot feature — this is the recommended path for production. Enable daily automated backups with a retention window appropriate for the school's needs (e.g. 7–30 days), and confirm point-in-time recovery is enabled if the provider offers it.

**Self-hosted Postgres (Docker/VM)**
Take a logical dump on a schedule (e.g. a daily cron job or CI scheduled task):
```bash
pg_dump "$DATABASE_URL" -F c -f kaylan_backup_$(date +%Y%m%d).dump
```
Store the resulting `.dump` file somewhere durable and off the same host (S3, another server, etc.) — a backup that lives only on the same disk as the live database is not a real backup.

If using the provided `docker-compose.yml`, the `postgres` service's data directory should be mounted on a durable, persistent volume (not the container's ephemeral filesystem) — confirm this before relying on the container surviving a redeploy.

## Restoring

**From a `pg_dump -F c` dump:**
```bash
pg_restore -d "$DATABASE_URL" --clean --if-exists kaylan_backup_20260101.dump
```
`--clean --if-exists` drops existing objects before recreating them, so this is intended for restoring into an empty/throwaway database or a genuine disaster-recovery scenario — never run it against a live database you don't intend to fully overwrite.

**From a managed-provider snapshot:** follow the provider's own restore/point-in-time-recovery flow (typically restores to a new instance or a chosen timestamp) then repoint `DATABASE_URL` at the restored instance.

## After restoring

1. Run `cd backend && npx prisma migrate deploy` against the restored database to ensure its schema is at the same migration state as the running application code (a backup taken before a schema change will be behind; migrations bring it forward safely without touching existing rows they don't affect).
2. Restart the backend so it reconnects with a fresh connection pool.
3. Smoke-test: log in as an admin, confirm `/admin` dashboards load and show the restored data, and hit `GET /health` to confirm the app considers the database reachable and healthy.

## What this project does NOT currently provide

- No automated backup script or scheduled job is included in this repository — backup scheduling must be configured at the infrastructure/provider level as described above.
- No `backend/prisma/migrations/` directory exists in this repository yet (see `docs/DEPLOYMENT_CHECKLIST.md`) — an initial migration must be generated against a real database before "migrate deploy" can be used for schema versioning in production.
