# Installation

## Prerequisites
- **Node.js 20.x** (matches the `node:20-alpine` base images used by both Dockerfiles; the frontend's `package.json` targets Next.js 14 / React 18, which require Node ≥ 18.17 — Node 20 is recommended to match production exactly).
- **npm** (ships with Node; no yarn/pnpm lockfiles are present).
- **PostgreSQL 16** (matches `docker-compose.yml`'s `postgres:16-alpine`; any Postgres ≥ 13 that Prisma supports will work for local dev).
- A Cloudinary account (for avatar/attachment uploads) and SMTP credentials (for transactional email) if you want those features fully live — both degrade gracefully to a documented no-op path otherwise (`docs/TROUBLESHOOTING.md`).

## Frontend

```bash
git clone <repo-url>
cd kaylan-preschool-website
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

## Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET at minimum
npx prisma generate       # requires network access to binaries.prisma.sh
npx prisma migrate dev --name init
npx prisma db seed        # creates demo accounts (see docs/LOCAL_DEVELOPMENT.md)
npm run dev                # http://localhost:4000
```

## Verifying the install
```bash
# Frontend
npx next lint
npx tsc --noEmit
npm test

# Backend
npx prisma validate
npx tsc --noEmit
npm test
```
All of the above should be clean/passing. See `docs/LOCAL_DEVELOPMENT.md` for running both together and `docs/TROUBLESHOOTING.md` for common install issues.
