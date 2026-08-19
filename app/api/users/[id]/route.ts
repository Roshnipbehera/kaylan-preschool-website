import { NextRequest, NextResponse } from "next/server";
import { updateUserSchema } from "@/lib/validation/users";
import { readUsers, writeUsers } from "../_store";
import { logAction } from "@/lib/audit/logAction";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const users = await readUsers();
    const user = users.find((u) => u.id === params.id);
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to load user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const users = await readUsers();
    const idx = users.findIndex((u) => u.id === params.id);
    if (idx === -1) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const updated = { ...users[idx], ...parsed.data, updatedAt: new Date().toISOString() };
    users[idx] = updated;
    await writeUsers(users);
    await logAction({ actor: "Kaylan Admin", action: `Updated account for ${updated.name} (${updated.email})`, category: "users" });
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const users = await readUsers();
    const idx = users.findIndex((u) => u.id === params.id);
    if (idx === -1) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    const [removed] = users.splice(idx, 1);
    await writeUsers(users);
    await logAction({ actor: "Kaylan Admin", action: `Deleted ${removed.role} account for ${removed.name} (${removed.email})`, category: "users" });
    return NextResponse.json({ success: true, data: removed });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
  }
}
