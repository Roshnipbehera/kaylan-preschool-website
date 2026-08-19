import { NextRequest, NextResponse } from "next/server";
import { readProgressReports, writeProgressReports } from "../_store";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reports = await readProgressReports();
    const index = reports.findIndex((r) => r.id === params.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Progress report not found" }, { status: 404 });
    }
    const [removed] = reports.splice(index, 1);
    await writeProgressReports(reports);
    return NextResponse.json({ success: true, data: removed });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete progress report" }, { status: 500 });
  }
}
