// Live Fees client -- talks to the real Express backend
// (backend/src/controllers/feesController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous client that called app/api/fees/**; those
// route handlers and data/fees/*.json are left in place untouched but no
// longer imported by any live UI code. Function names/signatures unchanged
// so every consuming page needs zero changes. Does NOT add the mock
// payment-gateway "Pay Now" flow -- out of scope (future Payment Module).
import { apiFetch } from "@/lib/api/client";
import type { Invoice, Payment, PaymentMethod, InvoiceStatus, InvoiceLineItem } from "@/lib/types/fees";

export async function listInvoices(params?: { studentId?: string }): Promise<Invoice[]> {
  const qs = params?.studentId ? `?studentId=${encodeURIComponent(params.studentId)}` : "";
  return apiFetch<Invoice[]>(`/fees/invoices${qs}`, { cache: "no-store" });
}

export async function listPayments(params?: { studentId?: string }): Promise<Payment[]> {
  const qs = params?.studentId ? `?studentId=${encodeURIComponent(params.studentId)}` : "";
  return apiFetch<Payment[]>(`/fees/payments${qs}`, { cache: "no-store" });
}

// Admin-only additions below -- extend the fees client additively.
export interface CreateInvoicePayload {
  studentId: string;
  title: string;
  amount: number;
  dueDate: string;
  status?: InvoiceStatus;
  lineItems?: InvoiceLineItem[];
}

export async function createInvoice(input: CreateInvoicePayload): Promise<Invoice> {
  return apiFetch<Invoice>("/fees/invoices", { method: "POST", json: input });
}

export async function updateInvoice(id: string, input: Partial<CreateInvoicePayload>): Promise<Invoice> {
  return apiFetch<Invoice>(`/fees/invoices/${id}`, { method: "PATCH", json: input });
}

export async function deleteInvoice(id: string): Promise<Invoice> {
  return apiFetch<Invoice>(`/fees/invoices/${id}`, { method: "DELETE" });
}

export async function recordPayment(input: { invoiceId: string; studentId: string; amount: number; method: PaymentMethod }): Promise<Payment> {
  return apiFetch<Payment>("/fees/payments", { method: "POST", json: input });
}
