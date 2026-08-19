"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, CheckCircle, IndianRupee, Megaphone } from "lucide-react";
import { getAttendance, getUpcomingEvents } from "@/lib/api/user";
import { useAuth } from "@/lib/hooks/useAuth";
import { listStudents } from "@/lib/api/students";
import { listAttendance } from "@/lib/api/attendance";
import { listInvoices } from "@/lib/api/fees";
import { listAnnouncements } from "@/lib/api/announcements";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export function ParentDashboardContent() {
  const { user } = useAuth();
  const attendance = useQuery({ queryKey: queryKeys.attendance, queryFn: getAttendance });
  const events = useQuery({ queryKey: queryKeys.events, queryFn: getUpcomingEvents });

  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id),
    queryFn: () => listStudents({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });
  const primaryStudent = students?.[0];
  const monthKey = format(new Date(), "yyyy-MM");

  const monthAttendance = useQuery({
    queryKey: queryKeys.attendanceRecords(primaryStudent?.id ?? "", monthKey),
    queryFn: () => listAttendance({ studentId: primaryStudent!.id, month: monthKey }),
    enabled: !!primaryStudent?.id,
  });

  const invoices = useQuery({
    queryKey: queryKeys.invoices(user?.id),
    queryFn: () => listInvoices(),
    enabled: !!students,
  });

  const announcements = useQuery({ queryKey: queryKeys.announcements, queryFn: listAnnouncements });

  const attendancePct = (() => {
    const recs = monthAttendance.data ?? [];
    if (recs.length === 0) return null;
    const ok = recs.filter((r) => r.status === "present" || r.status === "late").length;
    return Math.round((ok / recs.length) * 100);
  })();

  const pendingAmount = (invoices.data ?? [])
    .filter((i) => students?.some((s) => s.id === i.studentId) && i.status !== "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      <ParentSubNav />

      <div className="mb-6 grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle size={18} className="text-leaf" /> Attendance This Month
            </CardTitle>
          </CardHeader>
          {monthAttendance.isLoading ? (
            <Skeleton className="h-9 w-16" />
          ) : (
            <p className="text-3xl font-bold text-[#3a2e4d]">{attendancePct ?? "—"}{attendancePct !== null ? "%" : ""}</p>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IndianRupee size={18} className="text-candy" /> Pending Fees
            </CardTitle>
          </CardHeader>
          {invoices.isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <p className="text-3xl font-bold text-[#3a2e4d]">Rs. {pendingAmount.toLocaleString("en-IN")}</p>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays size={18} className="text-sky" /> Next Event
            </CardTitle>
          </CardHeader>
          {events.isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : events.data && events.data.length > 0 ? (
            <div>
              <p className="font-heading font-semibold text-[#3a2e4d]">{events.data[0].title}</p>
              <p className="text-xs text-[#3a2e4d]/60">{events.data[0].date}</p>
            </div>
          ) : (
            <p className="text-sm text-[#3a2e4d]/60">No upcoming events</p>
          )}
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Megaphone size={18} className="text-orange" /> Recent Announcements
          </CardTitle>
          <Link href="/parent/announcements" className="text-sm font-heading font-semibold text-candy hover:underline">
            View all
          </Link>
        </CardHeader>
        {announcements.isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : !announcements.data || announcements.data.length === 0 ? (
          <p className="text-sm text-[#3a2e4d]/60">No announcements right now.</p>
        ) : (
          <ul className="space-y-2">
            {announcements.data.slice(0, 3).map((a) => (
              <li key={a.id} className="rounded-xl bg-[#faf9ff] px-3 py-2">
                <p className="font-heading text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-[#3a2e4d]/60">{new Date(a.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle size={20} className="text-leaf" /> This Week&apos;s Attendance
          </CardTitle>
        </CardHeader>
        {attendance.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {attendance.data?.map((a) => (
              <li key={a.date} className="flex items-center justify-between rounded-xl bg-[#faf9ff] px-3 py-2">
                <span className="font-heading text-sm">{a.date}</span>
                <Badge tone={a.status === "present" ? "leaf" : a.status === "late" ? "sunshine" : "candy"}>{a.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays size={20} className="text-sky" /> Upcoming Events
          </CardTitle>
        </CardHeader>
        {events.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {events.data?.map((e) => (
              <li key={e.id} className="rounded-xl bg-[#faf9ff] px-3 py-2">
                <p className="font-heading text-sm font-semibold">{e.title}</p>
                <p className="text-xs text-[#3a2e4d]/60">{e.date}</p>
                <p className="mt-1 text-sm text-[#3a2e4d]/70">{e.description}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
      </div>
    </div>
  );
}
