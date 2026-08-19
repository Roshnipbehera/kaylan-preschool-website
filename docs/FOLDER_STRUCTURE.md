# Folder Structure

```
kaylan-preschool-website/
├── app/                          Next.js 14 App Router
│   ├── (auth)/                   Route group: public auth pages (login, forgot-password, verify-email)
│   ├── (dashboard)/               Route group: protected pages (parent/, teacher/, admin/, profile/, settings/)
│   ├── 403/                       Role-mismatch page
│   ├── admissions/, blog/, events/, gallery/   Public marketing pages
│   ├── api/                       LEGACY Next.js JSON-file-backed route handlers. Most domains here are
│   │                              inert dead code (superseded by backend/src/controllers/**) EXCEPT
│   │                              downloads/, progress/, roles/, health/, upload-proxy/, which are still
│   │                              live and intentionally not part of the Express backend.
│   ├── layout.tsx, page.tsx       Root layout (fonts/metadata) and homepage
│   ├── error.tsx, global-error.tsx, not-found.tsx   App Router error boundaries
│   ├── sitemap.ts, robots.ts      SEO
│   └── providers.tsx              Client wrapper: React Query + Auth + Toast + Modal
├── components/                    Marketing site components (Hero, Navbar, Programs, ...) + subfolders:
│   ├── ui/                        Design-system primitives: Button, Input, Card, Modal, Toaster, Badge...
│   ├── layout/                    AuthLayout, DashboardShell
│   └── (feature folders)          e.g. messaging/, cms/ editors, dashboards per role
├── lib/
│   ├── api/                       One client module per domain; talks to the live Express backend via
│   │                              apiFetch (client.ts) for the vast majority of domains -- see docs/API.md.
│   ├── auth/                      AuthContext (useAuth), cookie helpers
│   ├── validation/                Zod schemas, one per domain, shared between forms and (historically) the
│   │                              legacy JSON API routes
│   ├── types/                     Shared TypeScript types per domain
│   ├── hooks/                     useAuth, useToast, useModal, useCmsSection, useNotifications, usePermissions
│   ├── query/                     React Query provider + query-key factories
│   ├── socket/                    Socket.io client wiring (client.ts, ioInstance.ts)
│   ├── messaging/                 Zustand store for live conversation/message state
│   ├── pdf/                       jsPDF generators (fee receipts, admission receipts)
│   ├── seo/                       Structured data (JSON-LD) helpers
│   └── config/                    theme.ts (documents the palette/fonts)
├── middleware.ts                  Edge middleware: protects (dashboard) routes, verifies JWT via jose,
│                                  enforces role match, CSRF cookie issuance
├── context/                       ToastContext (wraps sonner), ModalContext (focus-managed dialogs)
├── data/                          LEGACY JSON "database" files consumed only by the inert app/api/**
│                                  handlers listed above; confirmed unread by any live UI code path.
├── public/                        Static assets
├── __tests__/                     Vitest unit tests (frontend)
├── e2e/                           Playwright end-to-end tests
├── backend/                       Express + Prisma + PostgreSQL + Socket.io API service
│   ├── src/
│   │   ├── routes/                One router per domain, mounted in routes/index.ts under /api/v1
│   │   ├── controllers/           Business logic per domain, one file per route group
│   │   ├── middleware/            auth.ts (JWT/RBAC), csrf.ts, errorHandler.ts, requestLogger.ts
│   │   ├── socket/                Socket.io server setup, event handlers (index.ts)
│   │   ├── lib/                   audit.ts (logAudit), notify.ts (notifyUser/notifyUsers), mailer, etc.
│   │   ├── security/              Upload validation (messageAttachmentUpload)
│   │   ├── config/                logger.ts (pino), env loading
│   │   ├── models/                LEGACY Mongoose scaffold (Admission.ts, Event.ts, Rsvp.ts) -- dead code,
│   │   │                          never connected to a database in this configuration
│   │   └── app.ts, server.ts      Express app wiring, HTTP + Socket.io server bootstrap
│   ├── prisma/
│   │   ├── schema.prisma          Full data model (see docs/DATABASE.md)
│   │   └── seed.ts                Seeds demo accounts + sample data
│   └── tests/                     Jest unit + API tests (mocked Prisma client, no live DB required)
├── docker-compose.yml, Dockerfile, backend/Dockerfile   Container definitions (see docs/DOCKER.md)
└── docs/                          This documentation set
```
