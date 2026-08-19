import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createProgressReportSchema } from "@/lib/validation/progress";
import { readProgressReports, writeProgressReports } from "./_store";
import type { ProgressReport } from "@/lib/types/progress";

export async function GET(req: NextRequest) {
  try {
    const reports = await readProgressReports();
    const studentId = req.nextUrl.searchParams.get("studentId");
    const filtered = studentId ? reports.filter((r) => r.studentId === studentId) : reports;
    const sorted = [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list progress reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createProgressReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const reports = await readProgressReports();
    const report: ProgressReport = { id: randomUUID(), createdAt: new Date().toISOString(), ...parsed.data };
    reports.push(report);
    await writeProgressReports(reports);
    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create progress report" }, { status: 500 });
  }
}
