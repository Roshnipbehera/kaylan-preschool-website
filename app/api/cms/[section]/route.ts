// Route handler backing the CMS. Persists content JSON under data/cms/.
// Structured to mirror what a real backend REST endpoint (GET/PUT
// /api/v1/cms/:section) would look like, so Phase 3 wiring to the Express
// backend is a drop-in swap (see lib/api/cms.ts).
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { cmsSchemaMap, type CmsSchemaKey } from "@/lib/validation/cms";
import { logAction } from "@/lib/audit/logAction";

const DATA_DIR = path.join(process.cwd(), "data", "cms");

function isValidSection(section: string): section is CmsSchemaKey {
  return Object.prototype.hasOwnProperty.call(cmsSchemaMap, section);
}

function filePathFor(section: string) {
  return path.join(DATA_DIR, `${section}.json`);
}

export async function GET(_req: NextRequest, { params }: { params: { section: string } }) {
  const { section } = params;
  if (!isValidSection(section)) {
    return NextResponse.json({ success: false, message: `Unknown CMS section "${section}"` }, { status: 404 });
  }
  try {
    const raw = await fs.readFile(filePathFor(section), "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: `Could not read CMS section "${section}"` },
      { status: 404 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { section: string } }) {
  const { section } = params;
  if (!isValidSection(section)) {
    return NextResponse.json({ success: false, message: `Unknown CMS section "${section}"` }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const schema = cmsSchemaMap[section];
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePathFor(section), JSON.stringify(parsed.data, null, 2), "utf-8");
    await logAction({ actor: "Kaylan Admin", action: `CMS section '${section}' updated`, category: "cms" });
    return NextResponse.json({ success: true, data: parsed.data });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to persist content" }, { status: 500 });
  }
}
