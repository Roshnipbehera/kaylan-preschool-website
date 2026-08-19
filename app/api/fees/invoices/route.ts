import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { readInvoices, writeInvoices } from "../_store";
import { createInvoiceSchema } from "@/lib/validation/fees";
import { logAction } from "@/lib/audit/logAction";
import type { Invoice } from "@/lib/types/fees";

export async function GET(req: NextRequest) {
  try {
    const invoices = await readInvoices();
    const studentId = req.nextUrl.searchParams.get("studentId");
    const filtered = studentId ? invoices.filter((i) => i.studentId === studentId) : invoices;
    const sorted = [...filtered].sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list invoices" }, { status: 500 });
  }
}

// Admin-only: create a new invoice for a student.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const invoices = await readInvoices();
    const newInvoice: Invoice = {
      id: `invoice_${randomUUID()}`,
      studentId: parsed.data.studentId,
      title: parsed.data.title,
      status: parsed.data.status,
      amount: parsed.data.amount,
      dueDate: parsed.data.dueDate,
      issuedDate: new Date().toISOString().slice(0, 10),
      lineItems: parsed.data.lineItems,
    };
    invoices.push(newInvoice);
    await writeInvoices(invoices);
    await logAction({ actor: "Kaylan Admin", action: `Created invoice "${newInvoice.title}" for student ${newInvoice.studentId}`, category: "fees" });
    return NextResponse.json({ success: true, data: newInvoice }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create invoice" }, { status: 500 });
  }
}
