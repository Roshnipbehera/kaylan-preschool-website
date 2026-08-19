import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { updateAdmissionStatusSchema } from "@/lib/validation/admissions";
import type { AdmissionApplication } from "@/lib/types/admissions";
import { logAction } from "@/lib/audit/logAction";

const DATA_DIR = path.join(process.cwd(), "data", "admissions");

function filePathFor(id: string) {
  return path.join(DATA_DIR, `${id}.json`);
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const raw = await fs.readFile(filePathFor(params.id), "utf-8");
    return NextResponse.json({ success: true, data: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateAdmissionStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const raw = await fs.readFile(filePathFor(params.id), "utf-8");
    const existing = JSON.parse(raw) as AdmissionApplication;
    const updated: AdmissionApplication = {
      ...existing,
      status: parsed.data.status,
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(filePathFor(params.id), JSON.stringify(updated, null, 2), "utf-8");
    await logAction({ actor: "Kaylan Admin", action: `Application #${params.id} status changed to ${updated.status}`, category: "admissions" });
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
  }
}
