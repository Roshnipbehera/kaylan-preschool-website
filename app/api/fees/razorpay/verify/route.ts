import crypto from "crypto";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { readInvoices, writeInvoices, readPayments, writePayments } from "../../_store";
import { logAction } from "@/lib/audit/logAction";
import type { Payment } from "@/lib/types/fees";
import { z } from "zod";

const verifyPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = verifyPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { invoiceId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const invoices = await readInvoices();
  const invoice = invoices.find((i) => i.id === invoiceId);
  if (!invoice) {
    return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
  }

  if (invoice.status === "paid") {
    return NextResponse.json({ success: true, message: "Invoice already marked paid" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

  // If secret key is provided and this is not a mock order, verify HMAC SHA-256 signature
  if (keySecret && !razorpay_order_id.startsWith("order_mock_")) {
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature. Verification failed." },
        { status: 400 },
      );
    }
  }

  // Create payment record
  const payments = await readPayments();
  const newPayment: Payment = {
    id: `pay_${randomUUID()}`,
    invoiceId: invoice.id,
    studentId: invoice.studentId,
    amount: invoice.amount,
    method: "upi",
    status: "success",
    paidAt: new Date().toISOString(),
  };
  payments.push(newPayment);
  await writePayments(payments);

  // Mark invoice paid
  const invoiceIdx = invoices.findIndex((i) => i.id === invoice.id);
  if (invoiceIdx !== -1) {
    invoices[invoiceIdx] = { ...invoices[invoiceIdx], status: "paid" };
    await writeInvoices(invoices);
  }

  await logAction({
    actor: "Parent (Online Portal)",
    action: `Razorpay payment of Rs. ${invoice.amount} verified for '${invoice.title}' (Txn: ${razorpay_payment_id})`,
    category: "fees",
  });

  return NextResponse.json({
    success: true,
    data: {
      invoice: invoices[invoiceIdx],
      payment: newPayment,
      transactionId: razorpay_payment_id,
    },
  });
}
