# Deployment

## Environment variables
See `docs/ENVIRONMENT_VARIABLES.md` for the full table. At minimum for production: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (frontend and backend must share `JWT_ACCESS_SECRET`), `CLIENT_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`, `NEXT_PUBLIC_SITE_URL`, Cloudinary and SMTP credentials, `NODE_ENV=production` on both services.

## Build steps

**Backend**
```bash
cd backend
npm ci
npx prisma generate      # requires network access to binaries.prisma.sh
npm run build             # tsc -> dist/
```

**Frontend**
```bash
npm ci
npm run build              # requires network access to fonts.googleapis.com (next/font) — see docs/TROUBLESHOOTING.md
```
`next.config.js` is configured for `output: "standalone"`, producing a minimal self-contained server bundle (`.next/standalone`) suitable for the frontend Dockerfile.

## Migrations
Never use `prisma migrate dev` in production (it can prompt interactively and is meant for local schema iteration). Use:
```bash
cd backend
npx prisma migrate deploy    # applies pending migrations non-interactively, safe for CI/CD and containers
```
`docker-compose.yml`'s backend service already runs this automatically on container start (`sh -c "npx prisma migrate deploy && npx prisma db seed && node dist/server.js"`) — drop the seed step once real production data exists.

## Starting the compiled backend
```bash
cd backend
node dist/server.js     # or: npm start
```

## Deploying the Next.js standalone output
```bash
npm run build
node .next/standalone/server.js
```
Copy `public/` and `.next/static` alongside `.next/standalone/` if deploying the standalone bundle outside of the Docker image (the Dockerfile already does this — see `docs/DOCKER.md`).

## Docker images vs. bare-metal/PaaS
- **Docker (`docker-compose.yml` / the two Dockerfiles)** is the reference deployment path: builds both services as minimal Alpine images, wires them to a Postgres container, and runs migrations + seed + healthchecks automatically. Recommended for anything self-hosted (a VM, ECS, a k8s cluster consuming the same images).
- **Bare-metal/PaaS** (Render, Railway, Fly.io, a VPS, etc.): build each service with the steps above, point `DATABASE_URL` at a managed Postgres instance, run `prisma migrate deploy` as a release step (most PaaS platforms have a dedicated hook for this — don't run it inside the app's start command unless you're certain only one instance will run it concurrently), and set the environment variables per `docs/ENVIRONMENT_VARIABLES.md`. The frontend's standalone output and the backend's `dist/` are both plain Node processes — no Docker-specific behavior is required to run them.
- In both paths, the frontend and backend are separate deployable units communicating over HTTP + Socket.io — they do not need to share a host, only `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_SOCKET_URL` need to point at wherever the backend actually ends up.
