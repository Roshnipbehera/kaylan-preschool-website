import { Request, Response } from "express";
import { z } from "zod";
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
