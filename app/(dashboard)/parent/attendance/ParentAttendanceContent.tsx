"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { listStudents } from "@/lib/api/students";
import { listAttendance } from "@/lib/api/attendance";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AttendanceStatus } from "@/lib/types/attendance";

const STATUS_TONE: Record<AttendanceStatus, "leaf" | "sunshine" | "candy"> = {
  present: "leaf",
  late: "sunshine",
  absent: "candy",
};

export function ParentAttendanceContent() {
  const { user } = useAuth();
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const monthKey = format(monthCursor, "yyyy-MM");

  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id),
    queryFn: () => listStudents({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });
  const student = students?.[0];

  const { data: records, isLoading } = useQuery({
    queryKey: queryKeys.attendanceRecords(student?.id ?? "", monthKey),
    queryFn: () => listAttendance({ studentId: student!.id, month: monthKey }),
    enabled: !!student?.id,
  });

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(monthCursor), end: endOfMonth(monthCursor) }),
    [monthCursor],
  );

  const recordByDate = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    records?.forEach((r) => map.set(r.date, r.status));
    return map;
  }, [records]);

  const summary = useMemo(() => {
    const total = records?.length ?? 0;
    const present = records?.filter((r) => r.status === "present").length ?? 0;
    const late = records?.filter((r) => r.status === "late").length ?? 0;
    const absent = records?.filter((r) => r.status === "absent").length ?? 0;
    const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, late, absent, pct };
  }, [records]);

  return (
    <div data-testid="parent-attendance-page">
      <ParentSubNav />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Attendance {student ? `— ${student.fullName}` : ""}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
            <ChevronLeft size={16} />
          </Button>
          <span className="font-heading text-sm font-semibold">{format(monthCursor, "MMMM yyyy")}</span>
          <Button variant="outline" size="sm" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-[#faf9ff] p-4 text-center">
            <p className="text-2xl font-bold text-[#3a2e4d]">{summary.pct}%</p>
            <p className="text-xs text-[#3a2e4d]/60">Attendance</p>
          </div>
          <div className="rounded-xl bg-[#faf9ff] p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{summary.present}</p>
            <p className="text-xs text-[#3a2e4d]/60">Present</p>
          </div>
          <div className="rounded-xl bg-[#faf9ff] p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{summary.late}</p>
            <p className="text-xs text-[#3a2e4d]/60">Late</p>
          </div>
          <div className="rounded-xl bg-[#faf9ff] p-4 text-center">
            <p className="text-2xl font-bold text-pink-700">{summary.absent}</p>
            <p className="text-xs text-[#3a2e4d]/60">Absent</p>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <Card>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-heading font-semibold text-[#3a2e4d]/50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {Array.from({ length: days[0].getDay() }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const status = recordByDate.get(key);
              const weekend = isWeekend(day);
              return (
                <div
                  key={key}
                  className={`flex flex-col items-center justify-center rounded-xl p-2 text-xs ${
                    weekend ? "bg-black/5 text-[#3a2e4d]/30" : "bg-[#faf9ff]"
                  }`}
                >
                  <span className="font-heading font-semibold">{format(day, "d")}</span>
                  {status && (
                    <Badge tone={STATUS_TONE[status]} className="mt-1 px-1.5 py-0.5 text-[10px]">
                      {status}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
