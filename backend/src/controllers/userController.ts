import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { uploadImageBuffer } from "../config/cloudinary";
import { toJwtRole } from "../utils/token";
import { logAudit } from "../lib/audit";

const publicUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  isEmailVerified: true,
  avatarUrl: true,
  createdAt: true,
} as const;

export async function getProfile(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user?.sub }, select: publicUser });
  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, data: user });
}

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export async function updateProfile(req: Request, res: Response) {
  const updates = updateProfileSchema.parse(req.body);
  const user = await prisma.user.update({ where: { id: req.user?.sub }, data: updates, select: publicUser });
  res.json({ success: true, data: user });
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: req.user?.sub } });
  if (!user) throw new AppError("User not found", 404);

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) throw new AppError("Current password is incorrect", 401);

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  await prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });

  res.json({ success: true, data: null, message: "Password updated successfully" });
}

const settingsSchema = z.object({
  emailUpdates: z.boolean(),
  smsAlerts: z.boolean(),
  weeklyDigest: z.boolean(),
});

export async function updateSettings(req: Request, res: Response) {
  // Notification preferences are still JSON-backed (data/users/preferences.json
  // via app/api/preferences) -- not migrated in this pass. This endpoint
  // just validates and echoes back for contract parity.
  const settings = settingsSchema.parse(req.body);
  res.json({ success: true, data: settings });
}

export async function uploadAvatar(req: Request, res: Response) {
  if (!req.file) throw new AppError("No file uploaded", 400);

  const url = await uploadImageBuffer(req.file.buffer);
  const user = await prisma.user.update({ where: { id: req.user?.sub }, data: { avatarUrl: url }, select: publicUser });
  res.json({ success: true, data: { url, user } });
}

// ---------------------------------------------------------------------
// Admin CRUD (Part 2 of this pass). Every handler here is mounted behind
// requireAuth + requireRole("admin") in routes/userRoutes.ts -- self-profile
// handlers above stay reachable by any authenticated user.
// ---------------------------------------------------------------------

const managedUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  className: true,
  subject: true,
  createdAt: true,
  updatedAt: true,
} as const;

type ManagedUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  className: string | null;
  subject: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// NOTE: this deliberately does NOT populate linkedStudentIds. The
// parent-student link lives in data/students/students.json
// (Student.parentUserId), which per this pass's scope stays JSON-backed
// and is explicitly NOT migrated to Postgres -- the minimal `Student`
// Prisma model exists only to give the Messaging demo real conversation
// partners and is a different, unrelated row set (see schema.prisma's
// header comment). The frontend (AdminParentsContent.tsx) cross-references
// data/students/students.json itself via lib/api/students.ts to compute
// linkedStudentIds and to persist changes to them (adminUpdateStudent),
// rather than this controller reaching into the JSON domain from Node.
function toManagedUser(row: ManagedUserRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: toJwtRole(row.role as never),
    isActive: row.isActive,
    className: row.className ?? undefined,
    subject: row.subject ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const roleQuerySchema = z.object({
  role: z.enum(["parent", "teacher", "admin"]).optional(),
});

export async function listUsers(req: Request, res: Response) {
  const { role } = roleQuerySchema.parse(req.query);
  const rows = await prisma.user.findMany({
    where: role ? { role: role.toUpperCase() as never } : undefined,
    select: managedUserSelect,
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: rows.map(toManagedUser) });
}

export async function getUserById(req: Request, res: Response) {
  const row = await prisma.user.findUnique({ where: { id: req.params.id }, select: managedUserSelect });
  if (!row) throw new AppError("User not found", 404);
  res.json({ success: true, data: toManagedUser(row) });
}

const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["parent", "teacher", "admin"]),
  className: z.string().optional(),
  subject: z.string().optional(),
  // Accepted for request-contract parity with the admin UI's form payload
  // but intentionally ignored here -- see the toManagedUser comment above.
  linkedStudentIds: z.array(z.string()).optional(),
});

// Follows the same "invite / temp password shown once" convention the old
// JSON-mock AdminTeachersContent.tsx / AdminParentsContent.tsx used
// client-side (`kaylan-${random}` shown in a success toast, never
// persisted in plaintext). The server now owns generating it -- it hashes
// the temp password before storing and returns the PLAINTEXT value ONCE in
// the response payload so the admin UI can surface the same toast copy;
// it is never retrievable again after this response.
function generateTempPassword(): string {
  return `kaylan-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createUser(req: Request, res: Response) {
  const input = createUserSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError("A user with this email already exists", 409);

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role.toUpperCase() as never,
      passwordHash,
      isEmailVerified: false,
      className: input.role === "teacher" ? input.className : undefined,
      subject: input.role === "teacher" ? input.subject : undefined,
    },
    select: managedUserSelect,
  });

  await logAudit(req, {
    action: `Created ${input.role} user "${user.name}"`,
    category: "users",
    entity: "User",
    entityId: user.id,
    metadata: { role: input.role },
  });

  const data = toManagedUser(user);
  res.status(201).json({ success: true, data: { ...data, tempPassword } });
}

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  className: z.string().optional(),
  subject: z.string().optional(),
  linkedStudentIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function updateUser(req: Request, res: Response) {
  const input = updateUserSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("User not found", 404);

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      name: input.name,
      email: input.email,
      className: input.className,
      subject: input.subject,
      isActive: input.isActive,
    },
    select: managedUserSelect,
  });

  // input.linkedStudentIds intentionally not applied here -- see the
  // toManagedUser comment above; the frontend persists that link directly
  // to data/students/students.json via lib/api/students.ts.

  await logAudit(req, {
    action: `Updated user "${user.name}"`,
    category: "users",
    entity: "User",
    entityId: user.id,
  });

  res.json({ success: true, data: toManagedUser(user) });
}

// Soft-delete: flips isActive to false rather than deleting the row, since
// Message.senderId, ConversationParticipant.userId, RefreshToken.userId and
// Student.parentId all hold FK references to User that must survive a
// deactivated account (message history, conversation membership).
export async function deactivateUser(req: Request, res: Response) {
  const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("User not found", 404);

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isActive: false },
    select: managedUserSelect,
  });
  await prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });

  await logAudit(req, {
    action: `Deactivated user "${user.name}"`,
    category: "users",
    entity: "User",
    entityId: user.id,
  });

  res.json({ success: true, data: toManagedUser(user) });
}
