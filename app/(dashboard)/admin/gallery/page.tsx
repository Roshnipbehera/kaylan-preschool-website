import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AdminGalleryContent } from "./AdminGalleryContent";

export const metadata: Metadata = {
  title: "Gallery | Kaylan Preschool Admin",
  description: "Manage gallery albums, photos, and videos.",
};

export default function AdminGalleryPage() {
  return (
    <DashboardShell>
      <AdminGalleryContent />
    </DashboardShell>
  );
}
