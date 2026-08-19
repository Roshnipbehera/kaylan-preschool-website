import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentDashboardContent } from "./ParentDashboardContent";

export const metadata: Metadata = {
  title: "Parent Dashboard | Kaylan Preschool",
  description: "View your child's attendance and upcoming events.",
};

export default function ParentDashboardPage() {
  return (
    <DashboardShell>
      <ParentDashboardContent />
    </DashboardShell>
  );
}
