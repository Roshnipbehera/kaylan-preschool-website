import { z } from "zod";

export const lineItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
});

export const createInvoiceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  title: z.string().min(2, "Title is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  dueDate: z.string().min(4, "Due date is required"),
  status: z.enum(["paid", "pending", "overdue"]).default("pending"),
  lineItems: z.array(lineItemSchema).default([]),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export const recordPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice is required"),
  studentId: z.string().min(1, "Student is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  method: z.enum(["card", "bank-transfer", "cash", "upi"]),
});

export type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>;
export type RecordPaymentFormValues = z.infer<typeof recordPaymentSchema>;
