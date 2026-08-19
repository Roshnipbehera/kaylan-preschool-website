import { NextRequest, NextResponse } from "next/server";
import { updateStudentSchema, adminUpdateStudentSchema } from "@/lib/validation/students";
import { readStudents, writeStudents } from "../_store";
import { logAction } from "@/lib/audit/logAction";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const students = await readStudents();
    const student = students.find((s) => s.id === params.id);
    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: student });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to load student" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  // Accept either the narrow parent/teacher-facing shape or the broader
  // admin shape (extra optional fields like className/program/teacher).
  const adminParsed = adminUpdateStudentSchema.safeParse(body);
  const parsed = adminParsed.success ? adminParsed : updateStudentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const students = await readStudents();
    const idx = students.findIndex((s) => s.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    const updated = { ...students[idx], ...parsed.data, updatedAt: new Date().toISOString() };
    students[idx] = updated;
    await writeStudents(students);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update student" }, { status: 500 });
  }
}

// Admin-only: delete a student record.
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const students = await readStudents();
    const idx = students.findIndex((s) => s.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }
    const [removed] = students.splice(idx, 1);
    await writeStudents(students);
    await logAction({ actor: "Kaylan Admin", action: `Deleted student record for ${removed.fullName}`, category: "students" });
    return NextResponse.json({ success: true, data: removed });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete student" }, { status: 500 });
  }
}
