import { NextResponse } from "next/server";
import { readAuditLogs } from "@/lib/audit/logAction";

export async function GET() {
  try {
    const logs = await readAuditLogs();
    const sorted = [...logs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list audit logs" }, { status: 500 });
  }
}
