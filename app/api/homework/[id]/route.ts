import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateHomeworkFullSchema } from "@/lib/validation/homework";
import { readHomework, writeHomework } from "../_store";

const updateHomeworkSchema = z.object({
  status: z.enum(["pending", "submitted", "overdue"]),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  // Accept either a simple status-only patch (parent read flows) or a full
  // teacher edit (title/description/dates/subject/className/status).
  const statusOnly = updateHomeworkSchema.safeParse(body);
  const fullEdit = updateHomeworkFullSchema.safeParse(body);
  if (!statusOnly.success && !fullEdit.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: fullEdit.error?.flatten() },
      { status: 422 },
    );
  }

  try {
    const assignments = await readHomework();
    const index = assignments.findIndex((a) => a.id === params.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Homework not found" }, { status: 404 });
    }
    const patch = statusOnly.success ? statusOnly.data : fullEdit.success ? fullEdit.data : {};
    assignments[index] = { ...assignments[index], ...patch };
    await writeHomework(assignments);
    return NextResponse.json({ success: true, data: assignments[index] });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update homework" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const assignments = await readHomework();
    const index = assignments.findIndex((a) => a.id === params.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Homework not found" }, { status: 404 });
    }
    const [removed] = assignments.splice(index, 1);
    await writeHomework(assignments);
    return NextResponse.json({ success: true, data: removed });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete homework" }, { status: 500 });
  }
}
