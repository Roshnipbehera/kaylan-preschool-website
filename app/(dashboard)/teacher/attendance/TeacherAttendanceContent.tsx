"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { listStudents } from "@/lib/api/students";
import { listAttendance, bulkMarkAttendance } from "@/lib/api/attendance";
import { queryKeys } from "@/lib/query/keys";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AttendanceStatus } from "@/lib/types/attendance";

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; tone: string }[] = [
  { value: "present", label: "Present", tone: "bg-leaf/20 text-green-700 border-leaf" },
  { value: "late", label: "Late", tone: "bg-sunshine/20 text-yellow-700 border-sunshine" },
  { value: "absent", label: "Absent", tone: "bg-candy/20 text-pink-700 border-candy" },
];

export function TeacherAttendanceContent() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [entries, setEntries] = useState<Record<string, { status: AttendanceStatus; notes: string }>>({});
  const [saving, setSaving] = useState(false);

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: queryKeys.students(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listStudents({ teacherUserId: user?.id }),
    enabled: !!user?.id,
  });

  const { data: existingRecords, isLoading: loadingRecords } = useQuery({
    queryKey: queryKeys.teacherAttendance("all", date),
    queryFn: () => listAttendance({ date }),
    enabled: !!students && students.length > 0,
  });

  useEffect(() => {
    if (!students) return;
    const initial: Record<string, { status: AttendanceStatus; notes: string }> = {};
    students.forEach((s) => {
      const existing = existingRecords?.find((r) => r.studentId === s.id);
      initial[s.id] = { status: existing?.status ?? "present", notes: existing?.notes ?? "" };
    });
    setEntries(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, existingRecords, date]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setEntries((prev) => ({ ...prev, [studentId]: { ...prev[studentId], status } }));
  };
  const setNotes = (studentId: string, notes: string) => {
    setEntries((prev) => ({ ...prev, [studentId]: { ...prev[studentId], notes } }));
  };

  const summary = useMemo(() => {
    const values = Object.values(entries);
    return {
      present: values.filter((e) => e.status === "present").length,
      late: values.filter((e) => e.status === "late").length,
      absent: values.filter((e) => e.status === "absent").length,
    };
  }, [entries]);

  const handleSave = async () => {
    if (!students || !user?.id) return;
    setSaving(true);
    try {
      await bulkMarkAttendance({
        date,
        markedBy: user.name,
        entries: students.map((s) => ({
          studentId: s.id,
          status: entries[s.id]?.status ?? "present",
          notes: entries[s.id]?.notes || undefined,
        })),
      });
      toast.success("Attendance saved for " + format(new Date(date), "d MMM yyyy"));
      await queryClient.invalidateQueries({ queryKey: queryKeys.teacherAttendance("all", date) });
      await queryClient.invalidateQueries({ queryKey: ["attendance-records"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const isLoading = loadingStudents || loadingRecords;

  return (
    <div>
      <TeacherSubNav />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Mark Attendance</h1>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" aria-label="Attendance date" />
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-[#faf9ff] p-3">
            <p className="text-xl font-bold text-green-700">{summary.present}</p>
            <p className="text-xs text-[#3a2e4d]/60">Present</p>
          </div>
          <div className="rounded-xl bg-[#faf9ff] p-3">
            <p className="text-xl font-bold text-yellow-700">{summary.late}</p>
            <p className="text-xs text-[#3a2e4d]/60">Late</p>
          </div>
          <div className="rounded-xl bg-[#faf9ff] p-3">
            <p className="text-xl font-bold text-pink-700">{summary.absent}</p>
            <p className="text-xs text-[#3a2e4d]/60">Absent</p>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !students || students.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No students assigned to your class.</p>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{format(new Date(date), "EEEE, d MMMM yyyy")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {students.map((s) => (
              <div key={s.id} className="rounded-xl border border-black/5 p-3" data-testid={`attendance-row-${s.id}`}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-heading text-sm font-semibold text-[#3a2e4d]">{s.fullName}</span>
                  <div className="flex gap-1.5">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStatus(s.id, opt.value)}
                        data-testid={`attendance-status-${s.id}-${opt.value}`}
                        className={`rounded-full border-2 px-3 py-1 text-xs font-heading font-semibold transition-colors ${
                          entries[s.id]?.status === opt.value ? opt.tone : "border-black/10 bg-white text-[#3a2e4d]/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  placeholder="Notes (optional)"
                  value={entries[s.id]?.notes ?? ""}
                  onChange={(e) => setNotes(s.id, e.target.value)}
                  aria-label={`Notes for ${s.fullName}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} isLoading={saving} data-testid="attendance-save">
              Save Attendance
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
