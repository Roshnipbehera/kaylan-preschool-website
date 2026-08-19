import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { logAudit } from "../lib/audit";

// Live Daily Activities CRUD (Batch 2 migration pass). Replaces
// app/api/activities/** (JSON-backed, data/activities/logs.json). Response
// shape mirrors lib/types/activities.ts's ActivityLog exactly.
// RBAC: parents only ever see logs for their OWN children; teachers see
// logs for students in their own class(es) (via Student.teacherId); admin
// sees everything. Creation is teacher/admin only.

const createActivityLogSchema = z.object({
  studentId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  category: z.enum(["learning", "play", "meal", "nap", "art", "outdoor"]),
  title: z.string().min(1),
  notes: z.string().optional(),
  loggedBy: z.string().min(1),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
});

type ActivityRow = {
  id: string;
  studentId: string;
  date: string;
  time: string;
  category: string;
  title: string;
  notes: string | null;
  loggedBy: string;
  mediaUrl: string | null;
  mediaType: string | null;
};

function toActivityDto(row: ActivityRow) {
  return {
    id: row.id,
    studentId: row.studentId,
    date: row.date,
    time: row.time,
    category: row.category,
    title: row.title,
    notes: row.notes ?? undefined,
    loggedBy: row.loggedBy,
    mediaUrl: row.mediaUrl ?? undefined,
    mediaType: row.mediaType ?? undefined,
  };
}

export async function listActivityLogs(req: Request, res: Response) {
  const { studentId, studentIds } = req.query as { studentId?: string; studentIds?: string };
  const role = req.user?.role;

  let allowedIds: string[] | null = null;
  if (role === "parent") {
    const owned = await prisma.student.findMany({ where: { parentId: req.user?.sub }, select: { id: true } });
    allowedIds = owned.map((s: { id: string }) => s.id);
  } else if (role === "teacher") {
    const owned = await prisma.student.findMany({ where: { teacherId: req.user?.sub }, select: { id: true } });
    allowedIds = owned.map((s: { id: string }) => s.id);
  }

  let targetIds: string[] | undefined;
  if (studentId) targetIds = [studentId];
  else if (studentIds) targetIds = studentIds.split(",").filter(Boolean);

  if (allowedIds) {
    targetIds = targetIds ? targetIds.filter((id) => allowedIds!.includes(id)) : allowedIds;
  }

  const where: Record<string, unknown> = {};
  if (targetIds) where.studentId = { in: targetIds };

  const rows = await prisma.activityLog.findMany({ where, orderBy: [{ date: "desc" }, { time: "desc" }] });
  res.json({ success: true, data: rows.map((r) => toActivityDto(r as ActivityRow)) });
}

export async function createActivityLog(req: Request, res: Response) {
  const data = createActivityLogSchema.parse(req.body);

  if (req.user?.role === "teacher") {
    const student = await prisma.student.findUnique({ where: { id: data.studentId } });
    if (!student || student.teacherId !== req.user.sub) {
      throw new AppError("Forbidden: not your student", 403);
    }
  }

  const row = await prisma.activityLog.create({
    data: {
      studentId: data.studentId,
      date: data.date,
      time: data.time,
      category: data.category,
      title: data.title,
      notes: data.notes,
      loggedBy: data.loggedBy,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
    },
  });
  await logAudit(req, {
    action: "activity.create",
    category: "general",
    entity: "ActivityLog",
    entityId: row.id,
    metadata: { studentId: row.studentId, category: row.category, title: row.title },
  });
  res.status(201).json({ success: true, data: toActivityDto(row as ActivityRow) });
}
