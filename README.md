# Kaylan Preschool — Platform

[![Live Website](https://img.shields.io/badge/Live%20Website-kaylanpreschool.in-2ea44f?style=for-the-badge&logo=google-chrome&logoColor=white)](https://kaylanpreschool.in)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://kaylanpreschool.in)

> 🌐 **Official Live Website:** [https://kaylanpreschool.in](https://kaylanpreschool.in)  
> 🔗 **Alternative / Vercel Mirror:** [https://kaylan-preschool-website.vercel.app](https://kaylan-preschool-website.vercel.app)

A modern early-childhood education platform and public website for **Kaylan Preschool** (Electronic City, Bangalore). Blends Montessori-inspired learning with the Kreedo curriculum in a magical storybook world of play, discovery, creativity, and love. Features interactive admissions tour bookings, WhatsApp enquiries, dynamic photo galleries, curriculum highlights, and verified Google Maps integration.

This README has been rewritten as the final production-hardening close-out — it describes the system as it actually exists today, not an aspirational target. See `docs/` for the full documentation set.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, React Query, Zustand, Zod |
| Backend | Express, TypeScript, Prisma ORM, PostgreSQL, Socket.io |
| Auth | JWT (access + rotating refresh tokens), httpOnly cookies, RBAC, double-submit-cookie CSRF |
| Testing | Vitest + React Testing Library (frontend), Jest + Supertest (backend), Playwright (e2e) |
| DevOps | Docker, docker-compose, GitHub Actions CI, health endpoints, structured (pino) logging |

## Quick start

```bash
# 1. Clone
git clone <repo-url>
cd kaylan-preschool-website

# 2. Frontend
npm install
cp .env.example .env.local
npm run dev              # http://localhost:3000

# 3. Backend (separate terminal)
cd backend
npm install
cp .env.example .env     # fill in DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed        # demo accounts, see docs/LOCAL_DEVELOPMENT.md
npm run dev                # http://localhost:4000
```

Demo accounts: `parent@kaylan.school` / `teacher@kaylan.school` / `admin@kaylan.school`, all with password `password123`.

Or run everything with Docker:
```bash
docker compose up --build
```

## Documentation

| Doc | Covers |
|---|---|
| [`docs/INSTALLATION.md`](docs/INSTALLATION.md) | Prerequisites and step-by-step setup |
| [`docs/LOCAL_DEVELOPMENT.md`](docs/LOCAL_DEVELOPMENT.md) | Running both services, seeding, tests, hot-reload |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Production build, migrations, deployment paths |
| [`docs/DOCKER.md`](docs/DOCKER.md) | docker-compose usage, healthchecks, troubleshooting |
| [`docs/ENVIRONMENT_VARIABLES.md`](docs/ENVIRONMENT_VARIABLES.md) | Every env var, frontend + backend |
| [`docs/API.md`](docs/API.md) | Full REST API reference |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Prisma schema, models, ER overview |
| [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md) | Annotated project tree |
| [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md) | JWT/refresh/RBAC/CSRF flow |
| [`docs/MESSAGING.md`](docs/MESSAGING.md) | Socket.io architecture, event map |
| [`docs/CMS.md`](docs/CMS.md) | How the content-management system works |
| [`docs/guides/ADMIN_GUIDE.md`](docs/guides/ADMIN_GUIDE.md), [`TEACHER_GUIDE.md`](docs/guides/TEACHER_GUIDE.md), [`PARENT_GUIDE.md`](docs/guides/PARENT_GUIDE.md) | Non-technical end-user walkthroughs |
| [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) | Common issues and fixes |

## Project structure (short version)

```
app/            Next.js App Router — marketing pages, (auth)/(dashboard) route groups, legacy app/api/** JSON routes
components/     Marketing site + dashboard UI components
lib/            API clients, auth, validation, hooks, types, socket client, Zustand store
middleware.ts   Edge route protection (JWT verify, RBAC, CSRF cookie issuance)
backend/        Express + Prisma + PostgreSQL + Socket.io API service
docs/           Full documentation set (see table above)
```
Full annotated tree: [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md).

## Current status: what's live vs. legacy

Nearly every domain (auth, users, students, attendance, homework, activities, announcements, CMS, admissions, blog, gallery, events, fees, messaging, notifications, analytics, audit, settings) is fully migrated and live on the Express + Prisma + PostgreSQL backend. A small number of features (`downloads`, `progress`, the role/permission matrix editor) remain on this Next.js app's own legacy JSON-file-backed `app/api/**` routes — intentionally, as they were out of scope for the backend migration. The old JSON data files and superseded route handlers for already-migrated domains, plus a pre-Prisma Mongoose scaffold in `backend/src/models/`, are left in the repo as confirmed-inert dead code (see `docs/TROUBLESHOOTING.md`).

## Production readiness

- **Frontend**: `next lint` and `tsc --noEmit` are clean; 37/37 Vitest tests pass. `next build` cannot complete in network-restricted environments only because `next/font` fetches Google Fonts CSS at build time — not a code defect.
- **Backend**: `prisma validate` passes; `tsc --noEmit` is clean except for errors that only exist because `@prisma/client` hasn't been generated (needs network access to `binaries.prisma.sh`) — a documented, expected pattern, not a real bug; 59/59 Jest tests pass (unit + API, against a mocked Prisma client, no live DB required).
- **Not yet verified in any sandbox throughout this project's history**: an actual live run against a real Postgres instance, a real Docker daemon, or a real deployed environment — these have never been available in the development environment used across every phase. Code, tests, and schema are all consistent and internally verified; end-to-end verification against live infrastructure is the one remaining gap before a genuine production launch.

Security, performance, accessibility, SEO, and DevOps (Docker/CI/health/logging) hardening passes are all complete — see git history / prior phase notes for details of each pass.
