import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentFeesContent } from "./ParentFeesContent";

export const metadata: Metadata = {
  title: "Fee Status | Kaylan Preschool",
  description: "View fee status, due amounts, and download receipts.",
};

export default function ParentFeesPage() {
  return (
    <DashboardShell>
      <ParentFeesContent />
    </DashboardShell>
  );
}
