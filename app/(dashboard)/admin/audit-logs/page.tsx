import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { AdminAuditLogsContent } from "./AdminAuditLogsContent";

export const metadata: Metadata = {
  title: "Audit Logs | Kaylan Preschool Admin",
  description: "Review a real, append-only log of admin and system actions.",
};

export default function AdminAuditLogsPage() {
  return (
    <DashboardShell>
      <AdminSubNav />
      <AdminAuditLogsContent />
    </DashboardShell>
  );
}
