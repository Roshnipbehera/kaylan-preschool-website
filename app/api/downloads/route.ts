import { NextResponse } from "next/server";
import { readDownloadDocuments } from "./_store";

export async function GET() {
  try {
    const documents = await readDownloadDocuments();
    const sorted = [...documents].sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list documents" }, { status: 500 });
  }
}
