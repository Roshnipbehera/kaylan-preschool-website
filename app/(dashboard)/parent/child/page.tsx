import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ChildProfileContent } from "./ChildProfileContent";

export const metadata: Metadata = {
  title: "Child Profile | Kaylan Preschool",
  description: "View and manage your child's profile details.",
};

export default function ChildProfilePage() {
  return (
    <DashboardShell>
      <ChildProfileContent />
    </DashboardShell>
  );
}
