import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ParentActivitiesContent } from "./ParentActivitiesContent";

export const metadata: Metadata = {
  title: "Daily Activities | Kaylan Preschool",
  description: "See a timeline of your child's daily activities at school.",
};

export default function ParentActivitiesPage() {
  return (
    <DashboardShell>
      <ParentActivitiesContent />
    </DashboardShell>
  );
}
