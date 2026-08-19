import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherAttendanceContent } from "./TeacherAttendanceContent";

export const metadata: Metadata = {
  title: "Attendance | Teacher Dashboard",
  description: "Mark daily attendance for your class.",
};

export default function TeacherAttendancePage() {
  return (
    <DashboardShell>
      <TeacherAttendanceContent />
    </DashboardShell>
  );
}
