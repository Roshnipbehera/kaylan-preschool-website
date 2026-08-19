// Client-side PDF receipt generator using jsPDF. Produces a letterhead-style
// payment receipt for a paid fee invoice. Mirrors lib/pdf/admissionReceipt.ts.
import { jsPDF } from "jspdf";
import type { Invoice, Payment } from "@/lib/types/fees";

export function downloadFeeReceipt(invoice: Invoice, payment?: Payment) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 60;

  doc.setFillColor(255, 143, 177);
  doc.rect(0, 0, 595, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Kaylan Preschool", marginX, 45);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Fee Payment Receipt", marginX, 68);

  y = 130;
  doc.setTextColor(58, 46, 77);
  doc.setFontSize(11);

  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, marginX, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "-", marginX + 160, y);
    y += 22;
  };

  row("Invoice ID", invoice.id);
  row("Invoice Title", invoice.title);
  row("Amount", `Rs. ${invoice.amount.toLocaleString("en-IN")}`);
  row("Status", invoice.status.toUpperCase());
  row("Due Date", new Date(invoice.dueDate).toLocaleDateString());
  if (payment) {
    row("Payment Method", payment.method.replace("-", " ").toUpperCase());
    row("Paid On", new Date(payment.paidAt).toLocaleString());
    row("Payment ID", payment.id);
  }

  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(marginX, y, 595 - marginX, y);
  y += 24;

  doc.setFont("helvetica", "bold");
  doc.text("Fee Breakdown", marginX, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  invoice.lineItems.forEach((item) => {
    doc.text(item.label, marginX, y);
    doc.text(`Rs. ${item.amount.toLocaleString("en-IN")}`, marginX + 300, y);
    y += 20;
  });

  y += 20;
  doc.setDrawColor(200, 200, 200);
  doc.line(marginX, y, 595 - marginX, y);
  y += 30;
  doc.setFontSize(10);
  doc.setTextColor(120, 110, 130);
  doc.text("This receipt confirms payment received by Kaylan Preschool.", marginX, y);
  y += 16;
  doc.text("Please retain this document for your records.", marginX, y);

  doc.save(`kaylan-fee-receipt-${invoice.id}.pdf`);
}
