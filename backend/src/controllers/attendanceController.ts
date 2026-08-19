import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { logAudit } from "../lib/audit";
import { notifyUser } from "../lib/notify";

// Live Attendance CRUD (Batch 1 pass). Replaces app/api/attendance/**
// (JSON-backed). Response shape mirrors lib/types/attendance.ts's
// AttendanceRecord (date as yyyy-mm-dd string, notes always present).

type AttendanceRow = {
  id: string;
  studentId: string;
  date: Date;
  status: string;
  markedBy: string;
  notes: string;
};

function toAttendanceDto(row: AttendanceRow) {
  return {
    id: row.id,
    studentId: row.studentId,
    date: row.date.toISOString().slice(0, 10),
    status: row.status,
    markedBy: row.markedBy,
    notes: row.notes,
  };
}

const listQuerySchema = z.object({
  studentId: z.string().optional(),
  month: z.string().optional(), // yyyy-mm
  date: z.string().optional(), // yyyy-mm-dd
  className: z.string().optional(),
});

export async function listAttendance(req: Request, res: Response) {
  const { studentId, month, date, className } = listQuerySchema.parse(req.query);

  const where: Record<string, unknown> = {};

  // RBAC scoping: parents only ever see their own children's attendance.
  const role = req.user?.role;
  if (role === "parent") {
    const owned = await prisma.student.findMany({ where: { parentId: req.user?.sub }, select: { id: true } });
    const ownedIds = owned.map((s: { id: string }) => s.id);
    where.studentId = studentId && ownedIds.includes(studentId) ? studentId : { in: ownedIds };
  } else if (studentId) {
    where.studentId = studentId;
  }

  if (date) {
    where.date = new Date(date);
  } else if (month) {
    const [y, m] = month.split("-").map(Number);
    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 1));
    where.date = { gte: start, lt: end };
  }

  if (className) {
    const students = await prisma.student.findMany({ where: { className }, select: { id: true } });
    const idsInClass = students.map((s: { id: string }) => s.id);
    const existing = where.studentId as { in?: string[] } | string | undefined;
    if (typeof existing === "string") {
      // single studentId already pinned by parent-scoping/query; leave as-is,
      // className is just an additional (already-satisfied-or-not) filter.
      where.studentId = idsInClass.includes(existing) ? existing : "__none__";
    } else if (existing && existing.in) {
      where.studentId = { in: existing.in.filter((id) => idsInClass.includes(id)) };
    } else {
      where.studentId = { in: idsInClass };
    }
  }

  const rows = await prisma.attendance.findMany({ where, orderBy: { date: "asc" } });
  res.json({ success: true, data: rows.map(toAttendanceDto) });
}

const bulkEntrySchema = z.object({
  studentId: z.string().min(1),
  status: z.enum(["present", "absent", "late"]),
  notes: z.string().optional().default(""),
});

const bulkMarkSchema = z.object({
  date: z.string().min(1, "Date is required"),
  markedBy: z.string().min(1, "Marked by is required"),
  entries: z.array(bulkEntrySchema).min(1, "At least one student is required"),
});

// Bulk mark/upsert attendance for a whole class on a given date -- used by
// the Teacher Dashboard's daily attendance sheet. Teacher/admin only.
export async function bulkMarkAttendance(req: Request, res: Response) {
  const { date, markedBy, entries } = bulkMarkSchema.parse(req.body);
  const day = new Date(date);

  const saved = await prisma.$transaction(
    entries.map((entry) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: entry.studentId, date: day } },
        update: { status: entry.status, markedBy, notes: entry.notes ?? "" },
        create: { studentId: entry.studentId, date: day, status: entry.status, markedBy, notes: entry.notes ?? "" },
      }),
    ),
  );

  await logAudit(req, {
    action: `Attendance marked for ${entries.length} student(s) on ${date}`,
    category: "attendance",
    entity: "Attendance",
  });

  // Notify parents (absent/late only, to avoid a daily "present" ping flood).
  const notifyEntries = entries.filter((e) => e.status !== "present");
  if (notifyEntries.length) {
    const students = await prisma.student.findMany({
      where: { id: { in: notifyEntries.map((e) => e.studentId) } },
      select: { id: true, fullName: true, parentId: true },
    });
    const byId = new Map<string, { id: string; fullName: string; parentId: string }>(
      students.map((s: { id: string; fullName: string; parentId: string }) => [s.id, s]),
    );
    await Promise.all(
      notifyEntries.map((e) => {
        const student = byId.get(e.studentId);
        if (!student) return Promise.resolve();
        return notifyUser({
          userId: student.parentId,
          type: "ATTENDANCE",
          title: "Attendance update",
          body: `${student.fullName} was marked ${e.status} on ${date}.`,
          relatedEntityType: "Attendance",
          relatedEntityId: e.studentId,
        });
      }),
    );
  }

  res.status(201).json({ success: true, data: saved.map(toAttendanceDto) });
}
