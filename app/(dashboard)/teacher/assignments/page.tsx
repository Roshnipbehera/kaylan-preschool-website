import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherAssignmentsContent } from "./TeacherAssignmentsContent";

export const metadata: Metadata = {
  title: "Assignments | Teacher Dashboard",
  description: "Create and manage homework assignments for your class.",
};

export default function TeacherAssignmentsPage() {
  return (
    <DashboardShell>
      <TeacherAssignmentsContent />
    </DashboardShell>
  );
}
