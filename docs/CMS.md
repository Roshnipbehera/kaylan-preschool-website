# CMS (Content Management System)

A flexible, section-based CMS backed by a single `CmsSection` Postgres model rather than one table per page section.

## How it works
- **Model**: `CmsSection { id, sectionKey(unique), contentJson(Json), updatedAt, updatedByUserId? }` (`backend/prisma/schema.prisma`). One row per section; the shape of `contentJson` differs per section (a hero has headline/CTA text, a FAQ has a list of Q&A pairs, etc.) and is not constrained by the database — the frontend's TypeScript types are the contract.
- **API**: `GET /api/v1/cms/:sectionKey` is public (marketing pages read it unauthenticated); `PUT /api/v1/cms/:sectionKey` and `GET /api/v1/cms` (list all) are admin-only (`cmsController.ts`, `cmsRoutes.ts`).
- **Frontend contract**: `lib/types/cms.ts` defines `CmsSectionKey` (14 keys — see below) and `CmsSectionMap`, a discriminated map from key to its specific content-shape interface (`HomeContent`, `AboutContent`, `ProgramsContent`, etc.). This gives full type safety per section despite the loose `Json` column on the backend.

## Editing flow (admin)
1. Admin opens a CMS editor for a section (`components/.../CmsSectionEditor` — form fields generated per section shape).
2. On submit, the editor calls `updateCmsSection(section, data)` (`lib/api/cms.ts`) → `PUT /api/v1/cms/:sectionKey`.
3. Backend validates the caller is an authenticated admin (`requireAuth` + `requireRole("admin")`), upserts the `CmsSection` row, and writes an audit log entry via `logAudit()`.
4. The mutation's `onSuccess` (`useCmsMutation` in `lib/hooks/useCmsSection.ts`) writes the new value straight into the React Query cache, so the change is reflected immediately without a refetch.

## Consuming CMS content on marketing pages
Every public page section that's CMS-editable calls `useCmsSection(sectionKey, seed)` (`lib/hooks/useCmsSection.ts`). `seed` is the component's own hardcoded default content (the original hand-built design), passed as React Query's `initialData` — this means the page renders instantly with the seed content (no loading flash), then silently reconciles with whatever the CMS has stored once the query resolves, so admin edits become the new source of truth after the first save without ever showing a loading spinner or layout shift.

## Editable section keys (14 total)
`home`, `about`, `programs`, `teachers`, `testimonials`, `faq`, `curriculum`, `gallery`, `footer`, `navigation`, `admissions-steps`, `facilities`, `blog`, `events`.

Note: there is no separate "Curriculum" or "Programs" data model — both are fully represented as `CmsSection` rows (`sectionKey: "curriculum"` / `"programs"`), consumed by `components/Programs.tsx` / `components/Adventures.tsx` respectively via `useCmsSection`.
