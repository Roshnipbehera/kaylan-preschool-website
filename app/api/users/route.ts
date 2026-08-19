import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createUserSchema } from "@/lib/validation/users";
import { readUsers, writeUsers } from "./_store";
import { logAction } from "@/lib/audit/logAction";
import type { ManagedUser } from "@/lib/types/users";

export async function GET(req: NextRequest) {
  try {
    const users = await readUsers();
    const role = req.nextUrl.searchParams.get("role");
    const filtered = role ? users.filter((u) => u.role === role) : users;
    return NextResponse.json({ success: true, data: filtered });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const users = await readUsers();
    if (users.some((u) => u.email.toLowerCase() === parsed.data.email.toLowerCase())) {
      return NextResponse.json({ success: false, message: "A user with this email already exists" }, { status: 409 });
    }
    const now = new Date().toISOString();
    const newUser: ManagedUser = {
      id: `u_${randomUUID()}`,
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      isActive: true,
      className: parsed.data.className,
      subject: parsed.data.subject,
      linkedStudentIds: parsed.data.linkedStudentIds,
      createdAt: now,
      updatedAt: now,
    };
    users.push(newUser);
    await writeUsers(users);
    await logAction({ actor: "Kaylan Admin", action: `Created ${parsed.data.role} account for ${parsed.data.name} (${parsed.data.email})`, category: "users" });
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 });
  }
}
