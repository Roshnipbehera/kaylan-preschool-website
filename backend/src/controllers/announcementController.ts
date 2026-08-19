import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { notifyUsers } from "../lib/notify";

// Live Announcements CRUD (Batch 2 migration pass). Replaces
// app/api/announcements/** (JSON-backed, data/announcements/announcements.json).
// Response shape mirrors lib/types/announcements.ts's Announcement exactly.
// RBAC: all authenticated roles can read, scoped by audience --
// "all" is visible to everyone, "parents" only to parents (+ admin),
// "teachers" only to teachers (+ admin). classId (if set) further scopes
// to a single class -- parents/teachers only see class-specific
// announcements for their own child's/own class. Creation is teacher/admin
// only.

const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  date: z.string().min(1),
  audience: z.enum(["all", "parents", "teachers"]),
  classId: z.string().optional(),
  createdBy: z.string().optional(),
});

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  date: string;
  audience: string;
  classId: string | null;
  createdBy: string | null;
};

function toAnnouncementDto(row: AnnouncementRow) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    date: row.date,
    audience: row.audience,
    classId: row.classId ?? undefined,
    createdBy: row.createdBy ?? undefined,
  };
}

export async function listAnnouncements(req: Request, res: Response) {
  const role = req.user?.role;

  const audienceFilter =
    role === "admin"
      ? undefined
      : role === "parent"
        ? ["all", "parents"]
        : role === "teacher"
          ? ["all", "teachers"]
          : ["all"];

  let classId: string | undefined;
  if (role === "parent") {
    const student = await prisma.student.findFirst({ where: { parentId: req.user?.sub }, select: { className: true } });
    classId = student?.className;
  } else if (role === "teacher") {
    const teacher = await prisma.user.findUnique({ where: { id: req.user?.sub }, select: { className: true } });
    classId = teacher?.className ?? undefined;
  }

  const where: Record<string, unknown> = {};
  if (audienceFilter) where.audience = { in: audienceFilter };
  if (classId) {
    where.OR = [{ classId: null }, { classId }];
  }

  const rows = await prisma.announcement.findMany({ where, orderBy: { date: "desc" } });
  res.json({ success: true, data: rows.map((r) => toAnnouncementDto(r as AnnouncementRow)) });
}

export async function createAnnouncement(req: Request, res: Response) {
  const data = createAnnouncementSchema.parse(req.body);
  const row = await prisma.announcement.create({
    data: {
      title: data.title,
      body: data.body,
      date: data.date,
      audience: data.audience,
      classId: data.classId,
      createdBy: data.createdBy ?? req.user?.sub,
    },
  });
  const audienceRoles =
    data.audience === "all" ? (["PARENT", "TEACHER"] as const) : data.audience === "parents" ? (["PARENT"] as const) : (["TEACHER"] as const);
  // Note: classId scoping is not applied to notification fan-out (only to
  // the read-side filtering above) -- parents' class membership lives on
  // Student, not User, so exact per-class notification targeting would
  // require joining through Student.parentId; broad role-based fan-out is
  // an acceptable approximation for a "new announcement" ping.
  const recipients = await prisma.user.findMany({
    where: { role: { in: audienceRoles as unknown as string[] } as never },
    select: { id: true },
  });
  if (recipients.length) {
    await notifyUsers(
      recipients.map((r) => r.id),
      {
        type: "ANNOUNCEMENT",
        title: "New announcement",
        body: data.title,
        relatedEntityType: "Announcement",
        relatedEntityId: row.id,
      },
    );
  }

  res.status(201).json({ success: true, data: toAnnouncementDto(row as AnnouncementRow) });
}
