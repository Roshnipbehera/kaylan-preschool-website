import { promises as fs } from "fs";
import path from "path";
import type { Invoice, Payment } from "@/lib/types/fees";

const DATA_DIR = path.join(process.cwd(), "data", "fees");
const INVOICES_FILE = path.join(DATA_DIR, "invoices.json");
const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readInvoices(): Promise<Invoice[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(INVOICES_FILE, "utf-8");
    return JSON.parse(raw) as Invoice[];
  } catch {
    return [];
  }
}

export async function writeInvoices(invoices: Invoice[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(INVOICES_FILE, JSON.stringify(invoices, null, 2), "utf-8");
}

export async function readPayments(): Promise<Payment[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(PAYMENTS_FILE, "utf-8");
    return JSON.parse(raw) as Payment[];
  } catch {
    return [];
  }
}

export async function writePayments(payments: Payment[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(PAYMENTS_FILE, JSON.stringify(payments, null, 2), "utf-8");
}
