import { Request, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { logAudit } from "../lib/audit";
import { notifyUser } from "../lib/notify";

// Live Fees CRUD (Batch 4 migration pass). Replaces app/api/fees/**
// (JSON-backed, data/fees/{invoices,payments}.json). Response shape
// mirrors lib/types/fees.ts's Invoice/Payment exactly. Does NOT implement
// the mock payment-gateway "Pay Now" UI -- that is out of scope (future
// Payment Module); this only migrates the existing invoice/payment DATA
// model + admin management + PDF receipt data source.

const lineItemSchema = z.object({ label: z.string(), amount: z.number() });
const createInvoiceSchema = z.object({
  studentId: z.string().min(1),
  title: z.string().min(1),
  amount: z.number().int().nonnegative(),
  dueDate: z.string(),
  status: z.enum(["paid", "pending", "overdue"]).default("pending"),
  lineItems: z.array(lineItemSchema).default([]),
});
const updateInvoiceSchema = createInvoiceSchema.partial();

const recordPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  studentId: z.string().min(1),
  amount: z.number().int().positive(),
  method: z.enum(["card", "bank-transfer", "cash", "upi"]),
});

type InvoiceRow = {
  id: string;
  studentId: string;
  title: string;
  status: string;
  amount: number;
  dueDate: Date;
  issuedDate: Date;
  lineItems: unknown;
};
function toInvoiceDto(row: InvoiceRow) {
  return {
    id: row.id,
    studentId: row.studentId,
    title: row.title,
    status: row.status,
    amount: row.amount,
    dueDate: row.dueDate.toISOString().slice(0, 10),
    issuedDate: row.issuedDate.toISOString().slice(0, 10),
    lineItems: row.lineItems ?? [],
  };
}

type PaymentRow = { id: string; invoiceId: string; studentId: string; amount: number; method: string; status: string; paidAt: Date };
function toPaymentDto(row: PaymentRow) {
  return {
    id: row.id,
    invoiceId: row.invoiceId,
    studentId: row.studentId,
    amount: row.amount,
    method: row.method,
    status: row.status,
    paidAt: row.paidAt.toISOString(),
  };
}

export async function listInvoices(req: Request, res: Response) {
  const { studentId } = req.query as { studentId?: string };
  const invoices = await prisma.feeInvoice.findMany({
    where: studentId ? { studentId } : undefined,
    orderBy: { dueDate: "desc" },
  });
  res.json({ success: true, data: invoices.map((i) => toInvoiceDto(i as InvoiceRow)) });
}

export async function listPayments(req: Request, res: Response) {
  const { studentId } = req.query as { studentId?: string };
  const payments = await prisma.feePayment.findMany({
    where: studentId ? { studentId } : undefined,
    orderBy: { paidAt: "desc" },
  });
  res.json({ success: true, data: payments.map((p) => toPaymentDto(p as PaymentRow)) });
}

export async function createInvoice(req: Request, res: Response) {
  const data = createInvoiceSchema.parse(req.body);
  const invoice = await prisma.feeInvoice.create({
    data: { ...data, dueDate: new Date(data.dueDate), lineItems: data.lineItems as never },
  });
  await logAudit(req, {
    action: `Invoice '${invoice.title}' created for student ${invoice.studentId}`,
    category: "fees",
    entity: "FeeInvoice",
    entityId: invoice.id,
  });
  const student = await prisma.student.findUnique({ where: { id: invoice.studentId } });
  if (student?.parentId) {
    await notifyUser({
      userId: student.parentId,
      type: "FEE",
      title: "New fee invoice",
      body: `${invoice.title} of Rs. ${invoice.amount} is due by ${invoice.dueDate.toDateString()}.`,
      relatedEntityType: "FeeInvoice",
      relatedEntityId: invoice.id,
    });
  }
  res.status(201).json({ success: true, data: toInvoiceDto(invoice as InvoiceRow) });
}

export async function updateInvoice(req: Request, res: Response) {
  const data = updateInvoiceSchema.parse(req.body);
  try {
    const invoice = await prisma.feeInvoice.update({
      where: { id: req.params.id },
      data: { ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined, lineItems: data.lineItems as never },
    });
    await logAudit(req, {
      action: `Invoice '${invoice.title}' updated`,
      category: "fees",
      entity: "FeeInvoice",
      entityId: invoice.id,
    });
    res.json({ success: true, data: toInvoiceDto(invoice as InvoiceRow) });
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Invoice not found", 404);
  }
}

export async function deleteInvoice(req: Request, res: Response) {
  try {
    const invoice = await prisma.feeInvoice.delete({ where: { id: req.params.id } });
    await logAudit(req, {
      action: `Invoice '${invoice.title}' deleted`,
      category: "fees",
      entity: "FeeInvoice",
      entityId: invoice.id,
    });
    res.json({ success: true, data: toInvoiceDto(invoice as InvoiceRow) });
  } catch {
    throw new AppError("Invoice not found", 404);
  }
}

export async function recordPayment(req: Request, res: Response) {
  const data = recordPaymentSchema.parse(req.body);
  const invoice = await prisma.feeInvoice.findUnique({ where: { id: data.invoiceId } });
  if (!invoice) throw new AppError("Invoice not found", 404);

  const payment = await prisma.feePayment.create({
    data: { invoiceId: data.invoiceId, studentId: data.studentId, amount: data.amount, method: data.method, status: "success" },
  });

  const totalPaid = await prisma.feePayment.aggregate({
    where: { invoiceId: data.invoiceId, status: "success" },
    _sum: { amount: true },
  });
  if ((totalPaid._sum.amount ?? 0) >= invoice.amount) {
    await prisma.feeInvoice.update({ where: { id: invoice.id }, data: { status: "paid" } });
  }

  await logAudit(req, {
    action: `Payment of Rs. ${payment.amount} recorded for invoice '${invoice.title}'`,
    category: "fees",
    entity: "FeePayment",
    entityId: payment.id,
  });

  res.status(201).json({ success: true, data: toPaymentDto(payment as PaymentRow) });
}

const createRazorpayOrderSchema = z.object({
  invoiceId: z.string().min(1),
});

const verifyRazorpayPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function createRazorpayOrder(req: Request, res: Response) {
  const { invoiceId } = createRazorpayOrderSchema.parse(req.body);
  const invoice = await prisma.feeInvoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new AppError("Invoice not found", 404);
  if (invoice.status === "paid") throw new AppError("Invoice has already been paid", 400);

  const keyId = process.env.RAZORPAY_KEY_ID || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

  // If Razorpay keys are configured in environment, generate order via official SDK
  if (keyId && keySecret) {
    try {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const amountInPaise = Math.round(invoice.amount * 100);
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: invoice.id,
        notes: {
          studentId: invoice.studentId,
          invoiceTitle: invoice.title,
        },
      };

      const order = await razorpay.orders.create(options);
      return res.status(200).json({
        success: true,
        data: {
          orderId: order.id,
          amount: invoice.amount,
          currency: "INR",
          keyId,
          isSandbox: keyId.startsWith("rzp_test"),
        },
      });
    } catch (err) {
      throw new AppError(err instanceof Error ? err.message : "Razorpay order creation failed", 502);
    }
  }

  // Development/Sandbox fallback when live credentials are not yet configured
  const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return res.status(200).json({
    success: true,
    data: {
      orderId: mockOrderId,
      amount: invoice.amount,
      currency: "INR",
      keyId: "rzp_test_mock_mode",
      isSandbox: true,
    },
  });
}

export async function verifyRazorpayPayment(req: Request, res: Response) {
  const data = verifyRazorpayPaymentSchema.parse(req.body);
  const invoice = await prisma.feeInvoice.findUnique({ where: { id: data.invoiceId } });
  if (!invoice) throw new AppError("Invoice not found", 404);
  if (invoice.status === "paid") {
    return res.status(200).json({ success: true, message: "Invoice already marked paid" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

  // If real/test key secret is provided, verify the cryptographic HMAC SHA-256 signature
  if (keySecret && !data.razorpay_order_id.startsWith("order_mock_")) {
    const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== data.razorpay_signature) {
      throw new AppError("Invalid payment signature. Verification failed.", 400);
    }
  }

  // Record successful payment in PostgreSQL
  const payment = await prisma.feePayment.create({
    data: {
      invoiceId: invoice.id,
      studentId: invoice.studentId,
      amount: invoice.amount,
      method: "upi",
      status: "success",
    },
  });

  // Update invoice status to paid
  const updatedInvoice = await prisma.feeInvoice.update({
    where: { id: invoice.id },
    data: { status: "paid" },
  });

  await logAudit(req, {
    action: `Online Razorpay payment of Rs. ${payment.amount} verified for '${invoice.title}' (Txn: ${data.razorpay_payment_id})`,
    category: "fees",
    entity: "FeePayment",
    entityId: payment.id,
  });

  const student = await prisma.student.findUnique({ where: { id: invoice.studentId } });
  if (student?.parentId) {
    await notifyUser({
      userId: student.parentId,
      type: "FEE",
      title: "Fee Payment Received",
      body: `Your payment of Rs. ${invoice.amount} for '${invoice.title}' was successfully processed.`,
      relatedEntityType: "FeePayment",
      relatedEntityId: payment.id,
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      invoice: toInvoiceDto(updatedInvoice as InvoiceRow),
      payment: toPaymentDto(payment as PaymentRow),
      transactionId: data.razorpay_payment_id,
    },
  });
}

