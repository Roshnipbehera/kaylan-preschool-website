# Docker

## Local dev with a real Postgres
```bash
docker compose up --build
```
Starts three services (see `docker-compose.yml`):
- `postgres` (16-alpine) — port 5432, healthchecked via `pg_isready`.
- `backend` — port 4000, waits for `postgres`'s healthcheck to pass, then runs `prisma migrate deploy && prisma db seed && node dist/server.js`.
- `frontend` — port 3000, waits for `backend`'s healthcheck, built with `NEXT_PUBLIC_USE_MOCK_API=false` baked in.

No Redis service is defined by design — Socket.io presence tracking is currently an in-process `Map` (see `docs/MESSAGING.md`); a `redis:` service should only be added if the backend is ever scaled to multiple replicas.

## How the health checks work
- **backend**: `GET /health` (unauthenticated, mounted outside `/api/v1` — see `backend/src/app.ts`) checks DB connectivity; Docker's `HEALTHCHECK` directive and `docker-compose.yml`'s `healthcheck:` block both poll it every 10s. `frontend` and other consumers use `depends_on: condition: service_healthy` to wait for a real-ready backend, not just "container started".
- **frontend**: `GET /api/health` (a Next.js route handler) provides basic liveness for the frontend container itself.

## Rebuilding images
```bash
docker compose build --no-cache backend    # or frontend
docker compose up -d
```
Both Dockerfiles are multi-stage (deps → builder → runner) and copy only production artifacts into the final stage, so rebuilds after a dependency change should always start from a clean `deps` layer (`--no-cache`) to avoid stale `node_modules`.

## Common troubleshooting
- **Backend healthcheck failing** — almost always `DATABASE_URL` misconfigured or Postgres not yet ready; check `docker compose logs backend` and confirm `postgres`'s own healthcheck is green first.
- **`prisma generate` fails during image build** — needs network access to `binaries.prisma.sh` at build time; if building in a network-restricted CI runner or sandbox, this will fail — this is an infrastructure/network constraint, not a code defect (see `docs/TROUBLESHOOTING.md`).
- **Frontend can't reach the backend** — confirm `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_SOCKET_URL` point at the `backend` service name (Docker's internal DNS), not `localhost`, when both run inside `docker compose` — `localhost` inside the frontend container refers to the frontend container itself.
- **Port already in use** — another local Postgres/Node process on 5432/4000/3000; stop it or override the compose port mappings.
- **Seed re-runs every backend container start** — intentional for local/demo use (`prisma db seed` is idempotent, upsert-based); remove the `&& npx prisma db seed` clause from `docker-compose.yml`'s backend `command` once real production data exists.
