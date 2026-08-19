import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminEventsContent } from "./AdminEventsContent";

export const metadata: Metadata = {
  title: "Events | Kaylan Preschool Admin",
  description: "Create, edit, and manage school events and RSVPs.",
};

export default function AdminEventsPage() {
  return (
    <DashboardShell>
      <AdminEventsContent />
    </DashboardShell>
  );
}
