# Kaylan Preschool — Backend (Express + MongoDB)

A complete, correctly-typed Express + MongoDB + Mongoose + JWT + Nodemailer +
Cloudinary API for Kaylan Preschool. **This backend is scaffolded but not
currently running or wired to the frontend** — the Next.js app uses a mocked
API layer (see `../lib/api/*`) for Phase 1 so the site is demo-able without a
live database. This code is complete and type-checks cleanly; connecting it
is Phase 2.

## Stack

- Express 4, TypeScript, tsx (dev) / tsc (build)
- MongoDB + Mongoose (User model with bcrypt password hashing)
- JWT auth issued as an httpOnly cookie (`requireAuth`, `requireRole` middleware)
- Nodemailer for verification / password-reset emails (HTML templates included)
- Cloudinary for avatar uploads (via `multer` memory storage + upload stream)
- Zod for request validation
- Centralized error handling (`AppError`, `errorHandler`, `notFoundHandler`)

## Getting started

```bash
cd backend
cp .env.example .env   # fill in real values
npm install
npm run dev             # tsx watch src/server.ts
```

Build for production:

```bash
npm run build   # tsc -> dist/
npm start        # node dist/server.js
```

Type-check only:

```bash
npm run typecheck
```

## Environment variables (see `.env.example`)

| Variable | Purpose |
| --- | --- |
| `PORT` | Port the API listens on (default 4000) |
| `CLIENT_URL` | Origin of the Next.js frontend, used for CORS + email links |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | JWT signing secret and expiry |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Nodemailer transporter |

## API routes (mounted under `/api/v1`)

**Auth** (`/api/v1/auth`)
- `POST /register` — create account, sends verification email
- `POST /login` — validates email/password/role, sets httpOnly JWT cookie
- `POST /logout` — clears the session cookie
- `POST /forgot-password` — generates a reset token, emails a reset link
- `POST /reset-password` — consumes the reset token, sets a new password
- `GET /verify-email?token=...` — marks the account as verified
- `GET /me` — returns the current authenticated user (requires auth)

**Users** (`/api/v1/users`)
- `GET /me` — get profile (requires auth)
- `PATCH /me` — update profile (requires auth)
- `PATCH /me/password` — change password (requires auth)
- `PATCH /me/settings` — update notification preferences (requires auth)
- `POST /me/avatar` — upload avatar to Cloudinary via multer (requires auth)

## Connecting this to the frontend later

1. Run this backend (locally or via the root `docker-compose.yml`).
2. In the frontend, set `NEXT_PUBLIC_USE_MOCK_API=false` and
   `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1` in `.env.local`.
3. `lib/api/auth.ts`, `lib/api/user.ts`, and `lib/api/upload.ts` already branch
   on `USE_MOCK_API` and call `apiFetch` (see `lib/api/client.ts`) with the
   exact same shapes documented above — no other frontend code needs to change.
4. Swap `middleware.ts`'s mock-cookie decoding for verifying the real JWT
   the backend now issues (or keep it as-is, since the cookie name/shape are
   compatible enough to decode the same payload fields for redirects).
