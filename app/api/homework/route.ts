import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createHomeworkSchema } from "@/lib/validation/homework";
import { readHomework, writeHomework } from "./_store";
import type { Homework } from "@/lib/types/homework";

export async function GET(req: NextRequest) {
  try {
    const assignments = await readHomework();
    const className = req.nextUrl.searchParams.get("className");
    const teacherId = req.nextUrl.searchParams.get("teacherId");
    let filtered = className ? assignments.filter((a) => a.className === className) : assignments;
    if (teacherId) filtered = filtered.filter((a) => a.teacherId === teacherId);
    const sorted = [...filtered].sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list homework" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createHomeworkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const assignments = await readHomework();
    const homework: Homework = { id: randomUUID(), ...parsed.data };
    assignments.push(homework);
    await writeHomework(assignments);
    return NextResponse.json({ success: true, data: homework }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create homework" }, { status: 500 });
  }
}
