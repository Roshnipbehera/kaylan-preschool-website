import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { readPayments, writePayments, readInvoices, writeInvoices } from "../_store";
import { recordPaymentSchema } from "@/lib/validation/fees";
import { logAction } from "@/lib/audit/logAction";
import type { Payment } from "@/lib/types/fees";

export async function GET(req: NextRequest) {
  try {
    const payments = await readPayments();
    const studentId = req.nextUrl.searchParams.get("studentId");
    const filtered = studentId ? payments.filter((p) => p.studentId === studentId) : payments;
    const sorted = [...filtered].sort((a, b) => (a.paidAt < b.paidAt ? 1 : -1));
    return NextResponse.json({ success: true, data: sorted });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to list payments" }, { status: 500 });
  }
}

// Admin-only: record a payment against an invoice and mark it paid.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = recordPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const payments = await readPayments();
    const newPayment: Payment = {
      id: `payment_${randomUUID()}`,
      invoiceId: parsed.data.invoiceId,
      studentId: parsed.data.studentId,
      amount: parsed.data.amount,
      method: parsed.data.method,
      status: "success",
      paidAt: new Date().toISOString(),
    };
    payments.push(newPayment);
    await writePayments(payments);

    const invoices = await readInvoices();
    const idx = invoices.findIndex((i) => i.id === parsed.data.invoiceId);
    if (idx !== -1) {
      invoices[idx] = { ...invoices[idx], status: "paid" };
      await writeInvoices(invoices);
    }

    await logAction({ actor: "Kaylan Admin", action: `Recorded payment of ${parsed.data.amount} for invoice ${parsed.data.invoiceId}`, category: "fees" });
    return NextResponse.json({ success: true, data: newPayment }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to record payment" }, { status: 500 });
  }
}
