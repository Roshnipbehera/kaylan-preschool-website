import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { sendMessageSchema } from "@/lib/validation/messaging";
import { readMessages, writeMessages } from "../_store";
import type { Message } from "@/lib/types/messaging";

export async function GET(req: NextRequest) {
  try {
    const messages = await readMessages();
    const conversationId = req.nextUrl.searchParams.get("conversationId");
    const filtered = conversationId ? messages.filter((m) => m.conversationId === conversationId) : messages;
    const sorted = [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const messages = await readMessages();
    const message: Message = {
      id: randomUUID(),
      conversationId: parsed.data.conversationId,
      senderId: parsed.data.senderId,
      senderRole: parsed.data.senderRole,
      senderName: parsed.data.senderName,
      body: parsed.data.body,
      attachments: parsed.data.attachments ?? [],
      readBy: [parsed.data.senderId],
      createdAt: new Date().toISOString(),
    };
    messages.push(message);
    await writeMessages(messages);
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 500 });
  }
}
