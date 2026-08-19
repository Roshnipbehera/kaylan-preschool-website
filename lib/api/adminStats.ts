export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  admissionsThisMonth: number;
  admissionsByStatus: Record<string, number>;
  attendanceRate: number;
  attendanceSampleSize: number;
  fees: { totalInvoiced: number; totalPaid: number; totalPending: number; totalOverdue: number; feeCollectionRate: number };
  blogPostCount: number;
  galleryItemCount: number;
  upcomingEventsCount: number;
  paymentsCount: number;
}

// Live client -- talks to the real Express backend
// (backend/src/controllers/analyticsController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous client that called app/api/admin/stats
// (which computed stats from scattered JSON files); that route handler is
// left in place untouched but no longer imported by any live UI code.
import { apiFetch } from "@/lib/api/client";

export async function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/analytics/stats", { cache: "no-store" });
}
