import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { systemSettingsSchema } from "@/lib/validation/settings";
import { logAction } from "@/lib/audit/logAction";

const DATA_DIR = path.join(process.cwd(), "data", "settings");
const SETTINGS_FILE = path.join(DATA_DIR, "system.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function GET() {
  await ensureDir();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    return NextResponse.json({ success: true, data: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ success: false, message: "Settings not found" }, { status: 404 });
  }
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = systemSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    await ensureDir();
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(parsed.data, null, 2), "utf-8");
    await logAction({ actor: "Kaylan Admin", action: "Updated system settings", category: "settings" });
    return NextResponse.json({ success: true, data: parsed.data });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to persist settings" }, { status: 500 });
  }
}
