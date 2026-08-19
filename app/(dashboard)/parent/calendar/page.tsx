import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentCalendarContent } from "./ParentCalendarContent";

export const metadata: Metadata = {
  title: "Calendar | Kaylan Preschool",
  description: "A unified calendar of school events, homework due dates and fee due dates.",
};

export default function ParentCalendarPage() {
  return (
    <DashboardShell>
      <ParentCalendarContent />
    </DashboardShell>
  );
}
