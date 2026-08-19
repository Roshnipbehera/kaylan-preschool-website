# Local Development

## Running frontend + backend together
Two terminals:

```bash
# Terminal 1 — frontend
npm run dev            # http://localhost:3000, hot-reloads via Next.js Fast Refresh

# Terminal 2 — backend
cd backend
npm run dev             # tsx watch src/server.ts — restarts on file change, http://localhost:4000
```

Set the frontend's `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`, `NEXT_PUBLIC_SOCKET_URL=http://localhost:4000`, and `JWT_ACCESS_SECRET` identical to `backend/.env`'s value.

## Seeding the database
```bash
cd backend
npx prisma migrate dev   # applies migrations, creates the schema
npx prisma db seed       # runs prisma/seed.ts — demo accounts + sample data
```
Demo accounts (same across every phase of this project):

| Email | Password | Role |
|---|---|---|
| parent@kaylan.school | password123 | parent |
| teacher@kaylan.school | password123 | teacher |
| admin@kaylan.school | password123 | admin |

`prisma/seed.ts` upserts (safe to re-run without duplicating data).

## The `NEXT_PUBLIC_USE_MOCK_API` flag — still relevant?
Largely a legacy no-op today. It was introduced in the original Phase 1 scaffold when every domain was mock/in-memory. Since then, nearly every `lib/api/*.ts` client has been rewired to call the live Express backend unconditionally via `apiFetch`, regardless of this flag's value (see `docs/ENVIRONMENT_VARIABLES.md` for the exact exception list — `downloads`, `progress`, and `roles` clients still call this Next.js app's own JSON-file routes, unrelated to the flag). Leave it at its default (`true`) unless you're specifically working on one of those three legacy domains.

## Hot-reload behavior
- Frontend: Next.js Fast Refresh — component edits apply without a full reload; edits to `middleware.ts`, `next.config.js`, or route files trigger a fast rebuild.
- Backend: `tsx watch` restarts the whole process on any `.ts` file change under `src/`. Prisma schema changes require re-running `npx prisma generate` (and a migration) manually — they are not auto-applied by the watcher.

## Running tests locally
```bash
# Frontend (Vitest)
npm test                 # single run
npm run test:watch       # watch mode
npm run test:coverage
npm run test:e2e          # Playwright, needs a running dev server

# Backend (Jest)
npm test                  # unit tests only (tests/unit) — no DB required, Prisma client is mocked
npm run test:api          # API-level tests (tests/api) — also fully mocked, no live DB required
npm run test:all           # both
npm run test:coverage
```
Both backend test suites (`tests/unit` + `tests/api`) run against a mocked Prisma client (see `backend/tests/helpers`), so they pass without a live Postgres connection — this is intentional and is how CI runs them.
