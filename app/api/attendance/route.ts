import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { bulkAttendanceSchema } from "@/lib/validation/attendance";
import { readAttendanceRecords, writeAttendanceRecords } from "./_store";
import { readStudents } from "../students/_store";
import type { AttendanceRecord } from "@/lib/types/attendance";
import { logAction } from "@/lib/audit/logAction";

export async function GET(req: NextRequest) {
  try {
    const records = await readAttendanceRecords();
    const studentId = req.nextUrl.searchParams.get("studentId");
    const month = req.nextUrl.searchParams.get("month"); // yyyy-mm
    const date = req.nextUrl.searchParams.get("date"); // yyyy-mm-dd
    const className = req.nextUrl.searchParams.get("className");

    let filtered = studentId ? records.filter((r) => r.studentId === studentId) : records;
    if (month) filtered = filtered.filter((r) => r.date.startsWith(month));
    if (date) filtered = filtered.filter((r) => r.date === date);
    if (className) {
      const students = await readStudents();
      const idsInClass = new Set(students.filter((s) => s.className === className).map((s) => s.id));
      filtered = filtered.filter((r) => idsInClass.has(r.studentId));
    }

    const sorted = [...filtered].sort((a, b) => (a.date < b.date ? -1 : 1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list attendance" }, { status: 500 });
  }
}

// Bulk mark/upsert attendance for a whole class on a given date -- used by
// the Teacher Dashboard's daily attendance sheet. Upserts one record per
// (studentId, date) pair rather than duplicating entries.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bulkAttendanceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const records = await readAttendanceRecords();
    const { date, markedBy, entries } = parsed.data;

    const saved: AttendanceRecord[] = [];
    for (const entry of entries) {
      const existingIndex = records.findIndex((r) => r.studentId === entry.studentId && r.date === date);
      const record: AttendanceRecord = {
        id: existingIndex >= 0 ? records[existingIndex].id : randomUUID(),
        studentId: entry.studentId,
        date,
        status: entry.status,
        markedBy,
        notes: entry.notes,
      };
      if (existingIndex >= 0) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }
      saved.push(record);
    }

    await writeAttendanceRecords(records);
    await logAction({ actor: markedBy || "Teacher", action: `Attendance marked for ${entries.length} student(s) on ${date}`, category: "attendance" });
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to save attendance" }, { status: 500 });
  }
}
