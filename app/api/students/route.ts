import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createStudentSchema } from "@/lib/validation/students";
import { readStudents, writeStudents } from "./_store";
import { logAction } from "@/lib/audit/logAction";
import type { Student } from "@/lib/types/students";

export async function GET(req: NextRequest) {
  try {
    const students = await readStudents();
    const parentUserId = req.nextUrl.searchParams.get("parentUserId");
    const teacherUserId = req.nextUrl.searchParams.get("teacherUserId");
    let filtered = parentUserId ? students.filter((s) => s.parentUserId === parentUserId) : students;
    if (teacherUserId) filtered = filtered.filter((s) => s.teacherUserId === teacherUserId);
    return NextResponse.json({ success: true, data: filtered });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list students" }, { status: 500 });
  }
}

// Admin-only: create a new student record. Additive -- does not change the
// GET contract Parent/Teacher dashboards already rely on.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createStudentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const students = await readStudents();
    const now = new Date().toISOString();
    const newStudent: Student = {
      id: `student_${randomUUID()}`,
      ...parsed.data,
      createdAt: now,
      updatedAt: now,
    };
    students.push(newStudent);
    await writeStudents(students);
    await logAction({ actor: "Kaylan Admin", action: `Created student record for ${newStudent.fullName}`, category: "students" });
    return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create student" }, { status: 500 });
  }
}
