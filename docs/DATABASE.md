# Database Schema

PostgreSQL via Prisma. Full source of truth: `backend/prisma/schema.prisma`. All domains below are LIVE (confirmed by per-model comments in the schema and by `npx prisma validate` passing) except `Role`/`Permission`, which are modeled for a possible future fine-grained-permissions pass but not wired to any live route — the live authorization model today is the 3-value `UserRole` enum on `User`.

## Core / Auth
- **User** — `id, name, email(unique), passwordHash, role(PARENT|TEACHER|ADMIN), isEmailVerified, avatarUrl, isActive, className?, subject?`. Central identity for all three roles; `className`/`subject` are teacher-only fields denormalized here rather than a separate TeacherProfile table.
- **RefreshToken** — hashed, rotated per refresh call, `userId` FK, `expiresAt`, `revokedAt`.
- **Student** — full child-profile record: `parentId`/`teacherId` FKs to `User`, `fullName`, `dateOfBirth`, `program`, `className`, guardian + emergency-contact fields.

## Messaging
- **Conversation** — 1:1 conversations, optional `subject`.
- **ConversationParticipant** — join table `(conversationId, userId)` unique, per-user mute/archive/pin state.
- **Message** — `conversationId`, `senderId`, `body`, `replyToMessageId`, edit/pin/delete flags.
- **MessageDeletion** — per-user "delete for me" tombstone.
- **Attachment** — Cloudinary-hosted file metadata per message.
- **MessageReaction** — `(messageId, userId, emoji)` unique.
- **ReadReceipt** — `(messageId, userId)` unique.
- **Notification** — `userId`, `type` (MESSAGE/ANNOUNCEMENT/HOMEWORK/ATTENDANCE/FEE/EVENT), read flag.

Note: typing-presence state is intentionally NOT a table — it's ephemeral in-memory state in the Socket.io server (see `docs/MESSAGING.md`).

## Academics
- **Attendance** — one row per `(studentId, date)` unique, `status` (present/absent/late), `markedBy`.
- **Homework** — `className`, `subject`, `title`, `dueDate`, `status` (pending/submitted/overdue), optional `teacherId`.
- **ActivityLog** — daily activity entries per student: `category` (learning/play/meal/nap/art/outdoor), optional `mediaUrl`/`mediaType`.

## Content / Marketing
- **Announcement** — `audience` (all/parents/teachers), optional `classId`.
- **CmsSection** — one row per `sectionKey` (unique), flexible `contentJson` — see `docs/CMS.md`.
- **BlogAuthor** / **BlogPost** — `BlogPost.authorId` FK, markdown `body`, `published` flag.
- **GalleryAlbum** / **GalleryItem** — album has many ordered items (`order` column), `type` (image/video).
- **Event** / **EventRsvp** — public events with public (unauthenticated) RSVP submission.

## Admissions / Fees / Ops
- **AdmissionApplication** — `parentUserId` nullable (public form can be submitted logged-out), `child`/`guardian`/`medical`/`documents` as JSON blobs matching the Zod schema shapes 1:1, `status` enum (submitted/under_review/accepted/rejected/waitlisted).
- **FeeInvoice** / **FeePayment** — invoice has many payments, `lineItems` JSON.
- **AuditLog** — `userId` nullable (`onDelete: SetNull`), `action`, `category`, `entity`/`entityId`, `metadata` JSON. Written server-side by `backend/src/lib/audit.ts`'s `logAudit()`, called from every mutating controller.
- **SystemSetting** — simple `key -> value(Json)` store.
- **Role** / **Permission** — designed-only, not live (see above).

## ER Relationship Overview (text)

```
User (PARENT) 1──N Student            (parentId)
User (TEACHER) 1──N Student            (teacherId, optional)
Student 1──N Attendance
Student 1──N ActivityLog
User (TEACHER) 1──N Homework           (teacherId, optional)
User 1──N RefreshToken
User 1──N ConversationParticipant ──N──1 Conversation
Conversation 1──N Message ──1 User (sender)
Message 1──N MessageDeletion / Attachment / MessageReaction / ReadReceipt
User 1──N Notification
User 1──N AuditLog (nullable, SetNull on delete)
User (parentUserId, nullable) 1──N AdmissionApplication
BlogAuthor 1──N BlogPost
GalleryAlbum 1──N GalleryItem
Event 1──N EventRsvp
FeeInvoice 1──N FeePayment
Role 1──N Permission   (designed-only, not live)
```

## Validating the schema

```bash
cd backend
npx prisma validate   # syntax/relation check, no DB or network needed -- should always pass
npx prisma generate   # regenerates the Prisma Client -- requires network access to
                       # binaries.prisma.sh; fails in network-restricted sandboxes,
                       # not a schema defect
```
