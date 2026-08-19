import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentAttendanceContent } from "./ParentAttendanceContent";

export const metadata: Metadata = {
  title: "Attendance | Kaylan Preschool",
  description: "View your child's monthly attendance record.",
};

export default function ParentAttendancePage() {
  return (
    <DashboardShell>
      <ParentAttendanceContent />
    </DashboardShell>
  );
}
