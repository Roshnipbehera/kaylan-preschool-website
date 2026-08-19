import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { logAudit } from "../lib/audit";

// Live Student CRUD (Batch 1 migration pass). Replaces
// app/api/students/** (JSON-backed) as the source of truth. Response shape
// mirrors lib/types/students.ts's Student interface exactly (fullName,
// parentUserId, teacherUserId, emergencyContact nested object, etc.) so the
// frontend needs no shape changes beyond swapping lib/api/students.ts to
// call this backend instead of the old Next.js route handlers.

type StudentRow = {
  id: string;
  parentId: string;
  teacherId: string | null;
  fullName: string;
  dateOfBirth: Date;
  program: string;
  className: string;
  bloodGroup: string;
  allergies: string;
  photo: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  createdAt: Date;
  updatedAt: Date;
};

function toStudentDto(row: StudentRow) {
  return {
    id: row.id,
    parentUserId: row.parentId,
    teacherUserId: row.teacherId ?? undefined,
    fullName: row.fullName,
    dateOfBirth: row.dateOfBirth.toISOString().slice(0, 10),
    program: row.program,
    className: row.className,
    bloodGroup: row.bloodGroup,
    allergies: row.allergies,
    photo: row.photo,
    guardianName: row.guardianName,
    guardianPhone: row.guardianPhone,
    guardianEmail: row.guardianEmail,
    emergencyContact: {
      name: row.emergencyContactName,
      relationship: row.emergencyContactRelationship,
      phone: row.emergencyContactPhone,
    },
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const listQuerySchema = z.object({
  parentUserId: z.string().optional(),
  teacherUserId: z.string().optional(),
});

export async function listStudents(req: Request, res: Response) {
  const { parentUserId, teacherUserId } = listQuerySchema.parse(req.query);

  // RBAC scoping: parents only ever see their own children, teachers only
  // their own class roster, regardless of what query params are passed --
  // mirrors the old JSON route's filter-by-query-param contract but adds a
  // real authorization boundary the JSON route never had.
  const role = req.user?.role;
  const where: Record<string, unknown> = {};
  if (role === "parent") {
    where.parentId = req.user?.sub;
  } else if (role === "teacher") {
    where.teacherId = req.user?.sub;
  } else {
    if (parentUserId) where.parentId = parentUserId;
    if (teacherUserId) where.teacherId = teacherUserId;
  }

  const rows = await prisma.student.findMany({ where, orderBy: { createdAt: "asc" } });
  res.json({ success: true, data: rows.map(toStudentDto) });
}

async function assertReadAccess(req: Request, student: StudentRow) {
  const role = req.user?.role;
  if (role === "admin") return;
  if (role === "parent" && student.parentId === req.user?.sub) return;
  if (role === "teacher" && student.teacherId === req.user?.sub) return;
  throw new AppError("Forbidden", 403);
}

export async function getStudent(req: Request, res: Response) {
  const row = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!row) throw new AppError("Student not found", 404);
  await assertReadAccess(req, row);
  res.json({ success: true, data: toStudentDto(row) });
}

const emergencyContactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  relationship: z.string().min(2, "Relationship is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

// Narrow shape: what parent/teacher self-service update flows may change.
const updateStudentSchema = z.object({
  bloodGroup: z.string().min(1).optional(),
  allergies: z.string().optional(),
  photo: z.string().optional(),
  guardianName: z.string().min(2).optional(),
  guardianPhone: z.string().min(7).optional(),
  guardianEmail: z.string().email().optional(),
  emergencyContact: emergencyContactSchema.optional(),
});

// Broad shape: what admin create/edit may set (superset).
const adminStudentSchema = z.object({
  parentUserId: z.string().min(1).optional(),
  teacherUserId: z.string().optional(),
  fullName: z.string().min(2).optional(),
  dateOfBirth: z.string().min(4).optional(),
  program: z.string().min(1).optional(),
  className: z.string().min(1).optional(),
  bloodGroup: z.string().min(1).optional(),
  allergies: z.string().optional(),
  photo: z.string().optional(),
  guardianName: z.string().min(2).optional(),
  guardianPhone: z.string().min(7).optional(),
  guardianEmail: z.string().email().optional(),
  emergencyContact: emergencyContactSchema.optional(),
});

const createStudentSchema = z.object({
  parentUserId: z.string().min(1, "Parent is required"),
  teacherUserId: z.string().optional(),
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(4, "Date of birth is required"),
  program: z.string().min(1, "Program is required"),
  className: z.string().min(1, "Class is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  allergies: z.string().optional().default(""),
  photo: z.string().optional().default(""),
  guardianName: z.string().min(2, "Guardian name is required"),
  guardianPhone: z.string().min(7, "Enter a valid phone number"),
  guardianEmail: z.string().email("Enter a valid email"),
  emergencyContact: emergencyContactSchema,
});

export async function createStudent(req: Request, res: Response) {
  const input = createStudentSchema.parse(req.body);
  const row = await prisma.student.create({
    data: {
      parentId: input.parentUserId,
      teacherId: input.teacherUserId || undefined,
      fullName: input.fullName,
      dateOfBirth: new Date(input.dateOfBirth),
      program: input.program,
      className: input.className,
      bloodGroup: input.bloodGroup,
      allergies: input.allergies ?? "",
      photo: input.photo ?? "",
      guardianName: input.guardianName,
      guardianPhone: input.guardianPhone,
      guardianEmail: input.guardianEmail,
      emergencyContactName: input.emergencyContact.name,
      emergencyContactRelationship: input.emergencyContact.relationship,
      emergencyContactPhone: input.emergencyContact.phone,
    },
  });
  await logAudit(req, {
    action: `Added student "${row.fullName}"`,
    category: "students",
    entity: "Student",
    entityId: row.id,
  });
  res.status(201).json({ success: true, data: toStudentDto(row) });
}

export async function updateStudent(req: Request, res: Response) {
  const existing = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Student not found", 404);

  const role = req.user?.role;
  const isAdmin = role === "admin";
  if (!isAdmin) await assertReadAccess(req, existing);

  const parsed = isAdmin ? adminStudentSchema.parse(req.body) : updateStudentSchema.parse(req.body);

  const row = await prisma.student.update({
    where: { id: req.params.id },
    data: {
      parentId: isAdmin ? (parsed as z.infer<typeof adminStudentSchema>).parentUserId : undefined,
      teacherId: isAdmin ? (parsed as z.infer<typeof adminStudentSchema>).teacherUserId || undefined : undefined,
      fullName: isAdmin ? (parsed as z.infer<typeof adminStudentSchema>).fullName : undefined,
      dateOfBirth: isAdmin && (parsed as z.infer<typeof adminStudentSchema>).dateOfBirth
        ? new Date((parsed as z.infer<typeof adminStudentSchema>).dateOfBirth as string)
        : undefined,
      program: isAdmin ? (parsed as z.infer<typeof adminStudentSchema>).program : undefined,
      className: isAdmin ? (parsed as z.infer<typeof adminStudentSchema>).className : undefined,
      bloodGroup: parsed.bloodGroup,
      allergies: parsed.allergies,
      photo: parsed.photo,
      guardianName: parsed.guardianName,
      guardianPhone: parsed.guardianPhone,
      guardianEmail: parsed.guardianEmail,
      emergencyContactName: parsed.emergencyContact?.name,
      emergencyContactRelationship: parsed.emergencyContact?.relationship,
      emergencyContactPhone: parsed.emergencyContact?.phone,
    },
  });

  await logAudit(req, {
    action: `Updated student "${row.fullName}"`,
    category: "students",
    entity: "Student",
    entityId: row.id,
  });

  res.json({ success: true, data: toStudentDto(row) });
}

export async function deleteStudent(req: Request, res: Response) {
  const existing = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Student not found", 404);
  await prisma.student.delete({ where: { id: req.params.id } });
  await logAudit(req, {
    action: `Removed student "${existing.fullName}"`,
    category: "students",
    entity: "Student",
    entityId: existing.id,
  });
  res.json({ success: true, data: toStudentDto(existing) });
}
