import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PaymentHistoryContent } from "./PaymentHistoryContent";

export const metadata: Metadata = {
  title: "Payment History | Kaylan Preschool",
  description: "Review your past fee payments.",
};

export default function PaymentHistoryPage() {
  return (
    <DashboardShell>
      <PaymentHistoryContent />
    </DashboardShell>
  );
}
