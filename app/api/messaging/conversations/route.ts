import { NextRequest, NextResponse } from "next/server";
import { readConversations } from "../_store";

export async function GET(req: NextRequest) {
  try {
    const conversations = await readConversations();
    const parentUserId = req.nextUrl.searchParams.get("parentUserId");
    const teacherUserId = req.nextUrl.searchParams.get("teacherUserId");
    let filtered = conversations;
    if (parentUserId) filtered = filtered.filter((c) => c.parentUserId === parentUserId);
    if (teacherUserId) filtered = filtered.filter((c) => c.teacherUserId === teacherUserId);
    const sorted = [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list conversations" }, { status: 500 });
  }
}
