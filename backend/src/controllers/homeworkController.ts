import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { notifyUsers } from "../lib/notify";
import { logAudit } from "../lib/audit";

// Live Homework CRUD (Batch 1 pass). Replaces app/api/homework/**
// (JSON-backed). Response shape mirrors lib/types/homework.ts's Homework
// interface (assignedDate/dueDate as yyyy-mm-dd strings).

type HomeworkRow = {
  id: string;
  className: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: Date;
  dueDate: Date;
  status: string;
  teacherId: string | null;
};

function toHomeworkDto(row: HomeworkRow) {
  return {
    id: row.id,
    className: row.className,
    subject: row.subject,
    title: row.title,
    description: row.description,
    assignedDate: row.assignedDate.toISOString().slice(0, 10),
    dueDate: row.dueDate.toISOString().slice(0, 10),
    status: row.status,
    teacherId: row.teacherId ?? undefined,
  };
}

const listQuerySchema = z.object({
  className: z.string().optional(),
  teacherId: z.string().optional(),
});

export async function listHomework(req: Request, res: Response) {
  const { className, teacherId } = listQuerySchema.parse(req.query);

  const where: Record<string, unknown> = {};
  const role = req.user?.role;
  if (role === "parent") {
    // Parents see homework for their children's class(es) only.
    const students = await prisma.student.findMany({ where: { parentId: req.user?.sub }, select: { className: true } });
    const classNames = [...new Set(students.map((s: { className: string }) => s.className))];
    where.className = className && classNames.includes(className) ? className : { in: classNames };
  } else {
    if (className) where.className = className;
    if (teacherId) where.teacherId = teacherId;
  }

  const rows = await prisma.homework.findMany({ where, orderBy: { dueDate: "asc" } });
  res.json({ success: true, data: rows.map(toHomeworkDto) });
}

const createHomeworkSchema = z.object({
  className: z.string().min(1, "Class is required"),
  subject: z.string().min(1, "Subject is required"),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(2, "Description is required"),
  assignedDate: z.string().min(1, "Assigned date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["pending", "submitted", "overdue"]).default("pending"),
  teacherId: z.string().optional(),
});

export async function createHomework(req: Request, res: Response) {
  const input = createHomeworkSchema.parse(req.body);
  const row = await prisma.homework.create({
    data: {
      className: input.className,
      subject: input.subject,
      title: input.title,
      description: input.description,
      assignedDate: new Date(input.assignedDate),
      dueDate: new Date(input.dueDate),
      status: input.status,
      teacherId: input.teacherId || undefined,
    },
  });

  const parents = await prisma.student.findMany({ where: { className: row.className }, select: { parentId: true } });
  const parentIds: string[] = Array.from(new Set(parents.map((p: { parentId: string }) => p.parentId)));
  if (parentIds.length) {
    await notifyUsers(parentIds, {
      type: "HOMEWORK",
      title: "New homework assigned",
      body: `${row.title} (${row.subject}) is due ${row.dueDate.toISOString().slice(0, 10)}.`,
      relatedEntityType: "Homework",
      relatedEntityId: row.id,
    });
  }

  await logAudit(req, { action: "homework.create", category: "general", entity: "Homework", entityId: row.id, metadata: { className: row.className, title: row.title } });
  res.status(201).json({ success: true, data: toHomeworkDto(row) });
}

const updateHomeworkFullSchema = createHomeworkSchema.partial();

export async function updateHomework(req: Request, res: Response) {
  const existing = await prisma.homework.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Homework not found", 404);

  const parsed = updateHomeworkFullSchema.parse(req.body);
  const row = await prisma.homework.update({
    where: { id: req.params.id },
    data: {
      className: parsed.className,
      subject: parsed.subject,
      title: parsed.title,
      description: parsed.description,
      assignedDate: parsed.assignedDate ? new Date(parsed.assignedDate) : undefined,
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
      status: parsed.status,
      teacherId: parsed.teacherId,
    },
  });
  await logAudit(req, { action: "homework.update", category: "general", entity: "Homework", entityId: row.id });
  res.json({ success: true, data: toHomeworkDto(row) });
}

export async function deleteHomework(req: Request, res: Response) {
  const existing = await prisma.homework.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Homework not found", 404);
  await prisma.homework.delete({ where: { id: req.params.id } });
  await logAudit(req, { action: "homework.delete", category: "general", entity: "Homework", entityId: existing.id, metadata: { title: existing.title } });
  res.json({ success: true, data: toHomeworkDto(existing) });
}
