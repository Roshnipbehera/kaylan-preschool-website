// TypeScript interfaces for the Fees system (invoices + payment history).
// Mirrors data/fees/invoices.json and data/fees/payments.json.

export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface InvoiceLineItem {
  label: string;
  amount: number;
}

export interface Invoice {
  id: string;
  studentId: string;
  title: string;
  status: InvoiceStatus;
  amount: number;
  dueDate: string; // ISO date
  issuedDate: string; // ISO date
  lineItems: InvoiceLineItem[];
}

export type PaymentMethod = "card" | "bank-transfer" | "cash" | "upi";

export interface Payment {
  id: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  method: PaymentMethod;
  status: "success" | "failed";
  paidAt: string; // ISO datetime
}
