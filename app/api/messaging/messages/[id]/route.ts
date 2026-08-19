import { NextRequest, NextResponse } from "next/server";
import { markReadSchema } from "@/lib/validation/messaging";
import { readMessages, writeMessages } from "../../_store";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = markReadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const messages = await readMessages();
    const index = messages.findIndex((m) => m.id === params.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }
    const msg = messages[index];
    if (!msg.readBy.includes(parsed.data.userId)) {
      msg.readBy = [...msg.readBy, parsed.data.userId];
      messages[index] = msg;
      await writeMessages(messages);
    }
    return NextResponse.json({ success: true, data: msg });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update message" }, { status: 500 });
  }
}
