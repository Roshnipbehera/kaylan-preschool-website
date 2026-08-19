import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminBlogContent } from "./AdminBlogContent";

export const metadata: Metadata = {
  title: "Blog | Kaylan Preschool Admin",
  description: "Create, edit, and publish blog posts.",
};

export default function AdminBlogPage() {
  return (
    <DashboardShell>
      <AdminBlogContent />
    </DashboardShell>
  );
}
