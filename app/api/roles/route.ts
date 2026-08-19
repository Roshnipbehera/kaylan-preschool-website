import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { rolePermissionsSchema } from "@/lib/validation/roles";
import { logAction } from "@/lib/audit/logAction";
import type { RolePermissions } from "@/lib/types/roles";

const DATA_DIR = path.join(process.cwd(), "data", "roles");
const ROLES_FILE = path.join(DATA_DIR, "roles.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function GET() {
  await ensureDir();
  try {
    const raw = await fs.readFile(ROLES_FILE, "utf-8");
    return NextResponse.json({ success: true, data: JSON.parse(raw) as RolePermissions[] });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = rolePermissionsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    await ensureDir();
    await fs.writeFile(ROLES_FILE, JSON.stringify(parsed.data, null, 2), "utf-8");
    await logAction({ actor: "Kaylan Admin", action: "Updated role permission matrix", category: "roles" });
    return NextResponse.json({ success: true, data: parsed.data });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to persist roles" }, { status: 500 });
  }
}
