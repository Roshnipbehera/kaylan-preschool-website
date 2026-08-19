# API Reference

All routes are mounted under `/api/v1` (see `backend/src/routes/index.ts` and `backend/src/app.ts`). Base URL in development: `http://localhost:4000/api/v1`.

Auth column: **Public** = no token needed · **Auth** = any authenticated user (`requireAuth`) · **Role(x)** = authenticated + `requireRole(x)`.

Health check (mounted separately, not versioned): `GET /health`.

## Auth — `/api/v1/auth` (`authRoutes.ts`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public (rate-limited) | Create a new user account. |
| POST | `/login` | Public (rate-limited) | Authenticate; issues access + refresh tokens as httpOnly cookies. |
| POST | `/refresh` | Public (needs valid refresh cookie) | Rotates the refresh token, issues a new access token. |
| POST | `/logout` | Public | Clears auth cookies, revokes the refresh token. |
| POST | `/forgot-password` | Public (rate-limited) | Emails a password-reset token. |
| POST | `/reset-password` | Public (rate-limited) | Consumes the reset token, sets a new password. |
| GET | `/verify-email` | Public | Consumes an email-verification token. |
| GET | `/me` | Auth | Returns the current user. |

## Users — `/api/v1/users` (`userRoutes.ts`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/me` | Auth | Get own profile. |
| PATCH | `/me` | Auth | Update own profile. |
| PATCH | `/me/password` | Auth | Change own password. |
| PATCH | `/me/settings` | Auth | Update notification/UI settings. |
| POST | `/me/avatar` | Auth | Upload avatar (multipart, 5 MB limit). |
| GET | `/` | Role(admin) | List all users. |
| POST | `/` | Role(admin) | Create a user. |
| GET | `/:id` | Role(admin) | Get a user by id. |
| PATCH | `/:id` | Role(admin) | Update a user. |
| DELETE | `/:id` | Role(admin) | Deactivate a user (soft delete). |

## Conversations & Messages — `/api/v1/conversations`, `/api/v1/messages`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/conversations` | Auth | List the caller's conversations. |
| GET | `/conversations/search` | Auth | Search conversations. |
| POST | `/conversations` | Auth | Create a 1:1 conversation. |
| PATCH | `/conversations/:id/state` | Auth | Update participant state (mute/archive/pin). |
| GET | `/conversations/:id/messages` | Auth | Paginated message history. |
| POST | `/conversations/:id/read` | Auth | Mark conversation read. |
| POST | `/conversations/:id/attachments` | Auth | Upload up to 5 attachment files. |
| GET | `/messages/search` | Auth | Full-text search across messages. |
| POST | `/messages` | Auth (rate-limited 60/min) | Send a message. |
| PATCH | `/messages/:id` | Auth | Edit a message. |
| DELETE | `/messages/:id` | Auth | Delete (for me / for everyone). |
| PATCH | `/messages/:id/pin` | Auth | Pin/unpin a message. |
| POST | `/messages/:id/reactions` | Auth | React with an emoji. |
| DELETE | `/messages/:id/reactions/:emoji` | Auth | Remove own reaction. |

Real-time layer: Socket.io attached to the same HTTP server — see `docs/MESSAGING.md`.

## Students — `/api/v1/students` (`studentRoutes.ts`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Auth | List students (scoped to caller's own children/class for parent/teacher; all for admin). |
| GET | `/:id` | Auth | Get a student. |
| PATCH | `/:id` | Auth | Update a student (field-level scoping enforced in controller). |
| POST | `/` | Role(admin) | Create a student. |
| DELETE | `/:id` | Role(admin) | Delete a student. |

## Attendance — `/api/v1/attendance`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Auth | List attendance records. |
| POST | `/` | Role(teacher, admin) | Bulk-mark attendance for a class/date. |

## Homework — `/api/v1/homework`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Auth | List homework. |
| POST | `/` | Role(teacher, admin) | Create a homework assignment. |
| PATCH | `/:id` | Auth | Update (teacher/admin full edit, parent status-only submit). |
| DELETE | `/:id` | Role(teacher, admin) | Delete an assignment. |

## Admissions — `/api/v1/admissions`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Public (rate-limited) | Submit an admission application. |
| GET | `/` | Role(admin) | List applications. |
| GET | `/:id` | Auth | Get an application (owner or admin). |
| PATCH | `/:id/status` | Role(admin) | Update application status. |

## Activities — `/api/v1/activities`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Auth | List activity logs. |
| POST | `/` | Role(teacher, admin) | Log a daily activity (photo/video). |

## Announcements — `/api/v1/announcements`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Auth | List announcements (filtered by audience). |
| POST | `/` | Role(teacher, admin) | Post an announcement. |

## CMS — `/api/v1/cms`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Role(admin) | List all CMS sections. |
| GET | `/:sectionKey` | Public | Get one section's content (consumed by marketing pages). |
| PUT | `/:sectionKey` | Role(admin) | Upsert a section's JSON content. |

## Events — `/api/v1/events`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List events. |
| GET | `/:id` | Public | Get an event. |
| POST | `/` | Role(admin) | Create an event. |
| PATCH | `/:id` | Role(admin) | Update an event. |
| DELETE | `/:id` | Role(admin) | Delete an event. |
| POST | `/:id/rsvp` | Public | RSVP to an event. |
| GET | `/:id/rsvp` | Role(admin) | List RSVPs. |

## Blog — `/api/v1/blog`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/authors` | Public | List blog authors. |
| GET | `/author/:authorSlug` | Public | Posts by author. |
| GET | `/` | Public | List posts. |
| GET | `/:slug` | Public | Get a post. |
| POST | `/` | Role(admin) | Create a post. |
| PATCH | `/:slug` | Role(admin) | Update a post. |
| DELETE | `/:slug` | Role(admin) | Delete a post. |

## Gallery — `/api/v1/gallery`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List albums. |
| GET | `/:id` | Public | Get an album. |
| POST | `/` | Role(admin) | Create an album. |
| PATCH | `/:id` | Role(admin) | Update an album. |
| DELETE | `/:id` | Role(admin) | Delete an album. |

## Fees — `/api/v1/fees`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/invoices` | Auth | List invoices (scoped for parent). |
| GET | `/payments` | Auth | List payments. |
| POST | `/invoices` | Role(admin) | Create an invoice. |
| PATCH | `/invoices/:id` | Role(admin) | Update an invoice. |
| DELETE | `/invoices/:id` | Role(admin) | Delete an invoice. |
| POST | `/payments` | Auth | Record a payment. |

## Notifications — `/api/v1/notifications`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Auth | List own notifications. |
| PATCH | `/:id/read` | Auth | Mark one read. |
| POST | `/read-all` | Auth | Mark all read. |

## Analytics — `/api/v1/analytics`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/stats` | Role(admin) | Aggregate dashboard stats (enrollment, attendance, fees, etc.). |

## Audit — `/api/v1/audit`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Role(admin) | List audit log entries. |

## Settings — `/api/v1/settings`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Role(admin) | Get system settings. |
| PUT | `/` | Role(admin) | Save system settings. |

## Health
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | Liveness/readiness probe (DB connectivity check) used by Docker healthchecks. |

## Not part of the Express backend
`roles` (role/permission matrix), `downloads`, and `progress` are still served by this Next.js app's own JSON-file-backed routes under `app/api/**` (see `lib/api/roles.ts`, `lib/api/downloads.ts`, `lib/api/progress.ts`) — they were not part of the Prisma migration scope and are not mounted in `backend/src/routes/index.ts`.
