import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createActivityLogSchema } from "@/lib/validation/activities";
import { readActivityLogs, writeActivityLogs } from "./_store";
import type { ActivityLog } from "@/lib/types/activities";

export async function GET(req: NextRequest) {
  try {
    const logs = await readActivityLogs();
    const studentId = req.nextUrl.searchParams.get("studentId");
    const studentIds = req.nextUrl.searchParams.get("studentIds"); // comma-separated
    let filtered = logs;
    if (studentId) filtered = filtered.filter((l) => l.studentId === studentId);
    else if (studentIds) {
      const ids = new Set(studentIds.split(",").filter(Boolean));
      filtered = filtered.filter((l) => ids.has(l.studentId));
    }
    const sorted = [...filtered].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.time < b.time ? 1 : -1;
    });
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list activity logs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createActivityLogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const logs = await readActivityLogs();
    const log: ActivityLog = { id: randomUUID(), ...parsed.data };
    logs.push(log);
    await writeActivityLogs(logs);
    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create activity log" }, { status: 500 });
  }
}
