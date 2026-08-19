# Administrator Guide

A practical walkthrough of the admin dashboard (`/admin`) — for school staff running the platform day-to-day, not developers.

## Signing in
Go to `/login` and sign in with your admin account. You'll land on `/admin`, the admin dashboard home.

## Managing website content (CMS)
`/admin/cms` — edit the content shown on the public marketing site (hero text, program descriptions, teacher profiles, testimonials, FAQ, facilities, footer, navigation, and more) without touching any code. Pick a section, edit the fields, and save — changes appear on the live site immediately. See `docs/CMS.md` for the technical details if needed.

## Reviewing admissions
`/admin/admissions` — see every submitted application (child details, guardian info, medical notes, uploaded documents). Change an application's status as it moves through your review process: Submitted → Under Review → Accepted / Waitlisted / Rejected. Applicants and existing parent accounts can track this status themselves on their side.

## Managing people
- `/admin/parents` and `/admin/teachers` — list, create, edit, and deactivate parent and teacher accounts. Deactivating an account (rather than deleting) preserves their history while blocking future logins.
- `/admin/students` — the full roster of enrolled children: class, program, guardian and emergency-contact info, and which parent/teacher accounts they're linked to.
- `/admin/roles` — the role/permission reference matrix (informational; the platform's actual access rules are fixed by role — Parent/Teacher/Admin).

## Analytics
`/admin/analytics` — dashboard-level stats: enrollment counts, attendance trends, fee collection status, and other at-a-glance numbers for the school.

## Managing fees
`/admin/fees` — create invoices for students, record payments, and track outstanding balances. Parents see their own child's invoices and payment history on their side automatically once created here.

## Content: blog, gallery, events
- `/admin/blog` — write and publish blog posts (markdown body, cover image, category/tags).
- `/admin/gallery` — create photo/video albums for the public gallery page.
- `/admin/events` — create school events; the public site lets visitors RSVP, and you can see the RSVP list here.

## Audit logs
`/admin/audit-logs` — a chronological record of every significant action taken across the platform (who did what, when) — useful for accountability and troubleshooting "who changed this?" questions.

## System settings
`/admin/settings` — school-wide configuration options.

## Messaging
`/admin/messages` — message parents or teachers directly (1:1 conversations). See `docs/guides/PARENT_GUIDE.md`/`docs/guides/TEACHER_GUIDE.md` for the messaging experience from those sides — it works the same way for admins.
