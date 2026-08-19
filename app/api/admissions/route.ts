// Route handler backing the Admissions system. Persists each application
// as its own JSON file under data/admissions/. Structured to mirror what a
// real backend REST endpoint (GET/POST /api/v1/admissions) would look
// like, so Phase 3 wiring to the Express backend is a drop-in swap (see
// lib/api/admissions.ts and backend/src/controllers/admissionController.ts).
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdmissionSchema } from "@/lib/validation/admissions";
import type { AdmissionApplication, AdmissionStatus } from "@/lib/types/admissions";

const DATA_DIR = path.join(process.cwd(), "data", "admissions");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readAll(): Promise<AdmissionApplication[]> {
  await ensureDir();
  const files = (await fs.readdir(DATA_DIR)).filter((f) => f.endsWith(".json"));
  const apps = await Promise.all(
    files.map(async (f) => JSON.parse(await fs.readFile(path.join(DATA_DIR, f), "utf-8")) as AdmissionApplication),
  );
  return apps.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parentUserId = searchParams.get("parentUserId");
    const status = searchParams.get("status") as AdmissionStatus | null;

    let apps = await readAll();
    if (parentUserId) apps = apps.filter((a) => a.parentUserId === parentUserId);
    if (status) apps = apps.filter((a) => a.status === status);

    return NextResponse.json({ success: true, data: apps });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to list applications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createAdmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const now = new Date().toISOString();
  const application: AdmissionApplication = {
    id: randomUUID(),
    ...parsed.data,
    status: "submitted",
    submittedAt: now,
    updatedAt: now,
  };

  try {
    await ensureDir();
    await fs.writeFile(path.join(DATA_DIR, `${application.id}.json`), JSON.stringify(application, null, 2), "utf-8");
    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to persist application" }, { status: 500 });
  }
}
