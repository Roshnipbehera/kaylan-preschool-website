import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentAdmissionsContent } from "./ParentAdmissionsContent";

export const metadata: Metadata = {
  title: "My Admission Applications | Kaylan Preschool",
  description: "Track the status of your child's admission application.",
};

export default function ParentAdmissionsPage() {
  return (
    <DashboardShell>
      <ParentAdmissionsContent />
    </DashboardShell>
  );
}
