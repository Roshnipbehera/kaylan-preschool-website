"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/api/adminStats";
import { queryKeys } from "@/lib/query/keys";
import { StatCard } from "@/components/admin/StatCard";
import { SimpleBarChart } from "@/components/admin/SimpleBarChart";
import { SimplePieChart } from "@/components/admin/SimplePieChart";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function AdminAnalyticsContent({ compact = false }: { compact?: boolean }) {
  const { data, isLoading, isError } = useQuery({ queryKey: queryKeys.adminStats, queryFn: getAdminStats });

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <p className="text-sm text-red-500">Failed to load analytics.</p>
      </Card>
    );
  }

  const admissionsData = Object.entries(data.admissionsByStatus).map(([label, value]) => ({
    label: label.replace("-", " "),
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard title="Total Students" value={data.totalStudents} />
        <StatCard title="Total Teachers" value={data.totalTeachers} />
        <StatCard title="Total Parents" value={data.totalParents} />
        <StatCard title="Admissions This Month" value={data.admissionsThisMonth} />
        <StatCard title="Attendance Rate (This Month)" value={`${data.attendanceRate}%`} sub={`${data.attendanceSampleSize} records`} />
        <StatCard title="Fee Collection Rate" value={`${data.fees.feeCollectionRate}%`} sub={`₹${data.fees.totalPaid.toLocaleString()} of ₹${data.fees.totalInvoiced.toLocaleString()}`} />
      </div>

      {!compact && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Admissions by Status (This Month)</CardTitle>
            </CardHeader>
            {admissionsData.length === 0 ? (
              <p className="text-sm text-[#3a2e4d]/60">No applications this month yet.</p>
            ) : (
              <SimplePieChart data={admissionsData} />
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fee Collection Breakdown</CardTitle>
            </CardHeader>
            <SimpleBarChart
              data={[
                { label: "Paid", value: data.fees.totalPaid },
                { label: "Pending", value: data.fees.totalPending },
                { label: "Overdue", value: data.fees.totalOverdue },
              ]}
            />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content & Engagement</CardTitle>
            </CardHeader>
            <SimpleBarChart
              colorClass="bg-sky"
              data={[
                { label: "Blog Posts", value: data.blogPostCount },
                { label: "Gallery Items", value: data.galleryItemCount },
                { label: "Upcoming Events", value: data.upcomingEventsCount },
              ]}
            />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payments Recorded</CardTitle>
            </CardHeader>
            <p className="text-3xl font-bold text-[#3a2e4d]">{data.paymentsCount}</p>
            <p className="mt-1 text-xs text-[#3a2e4d]/60">Total successful payment transactions on record.</p>
          </Card>
        </div>
      )}
    </div>
  );
}
