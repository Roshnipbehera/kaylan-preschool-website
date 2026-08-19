import { NextRequest, NextResponse } from "next/server";
import { settingsSchema } from "@/lib/validation/schemas";
import { readPreferences, writePreferences } from "./_store";

const DEFAULTS = { emailUpdates: true, smsAlerts: false, weeklyDigest: true };

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 });
    }
    const prefs = await readPreferences();
    const found = prefs.find((p) => p.userId === userId);
    return NextResponse.json({ success: true, data: found ?? { userId, ...DEFAULTS } });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to load preferences" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const prefs = await readPreferences();
    const index = prefs.findIndex((p) => p.userId === userId);
    const updated = { userId, ...parsed.data };
    if (index === -1) {
      prefs.push(updated);
    } else {
      prefs[index] = updated;
    }
    await writePreferences(prefs);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to save preferences" }, { status: 500 });
  }
}
