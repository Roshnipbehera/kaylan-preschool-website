// Client-side PDF receipt generator using jsPDF. Produces a simple
// letterhead-style receipt for a submitted admission application.
import { jsPDF } from "jspdf";
import type { AdmissionApplication } from "@/lib/types/admissions";

export function downloadAdmissionReceipt(app: AdmissionApplication) {
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
  doc.text("Admission Application Receipt", marginX, 68);

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

  row("Application ID", app.id);
  row("Child Name", app.child.fullName);
  row("Date of Birth", app.child.dateOfBirth);
  row("Program Applying For", app.child.programApplyingFor);
  row("Guardian Name", app.guardian.fullName);
  row("Guardian Contact", app.guardian.phone);
  row("Status", app.status.replace("-", " ").toUpperCase());
  row("Submitted On", new Date(app.submittedAt).toLocaleString());

  y += 20;
  doc.setDrawColor(200, 200, 200);
  doc.line(marginX, y, 595 - marginX, y);
  y += 30;
  doc.setFontSize(10);
  doc.setTextColor(120, 110, 130);
  doc.text(
    "This receipt confirms your admission application has been received by Kaylan Preschool.",
    marginX,
    y,
  );
  y += 16;
  doc.text("Please retain this document for your records.", marginX, y);

  doc.save(`kaylan-admission-receipt-${app.id}.pdf`);
}
