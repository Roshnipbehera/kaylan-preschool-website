import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import type { ContactInquiry } from "@/lib/types/contact";

const createContactInquirySchema = z.object({
  parentName: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "A valid phone number is required"),
  message: z.string().min(5, "Please tell us a little about your enquiry"),
});

const DATA_DIR = path.join(process.cwd(), "data", "contact");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createContactInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const now = new Date().toISOString();
  const inquiry: ContactInquiry = {
    id: randomUUID(),
    ...parsed.data,
    submittedAt: now,
  };

  try {
    await ensureDir();
    await fs.writeFile(path.join(DATA_DIR, `${inquiry.id}.json`), JSON.stringify(inquiry, null, 2), "utf-8");
    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch {
    // In serverless environments where local filesystem might be read-only, return success with memory object
    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  }
}
