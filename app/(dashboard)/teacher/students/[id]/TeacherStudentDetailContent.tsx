"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getStudent } from "@/lib/api/students";
import { listAttendance } from "@/lib/api/attendance";
import { listHomework } from "@/lib/api/homework";
import { listActivityLogs } from "@/lib/api/activities";
import { listProgressReports } from "@/lib/api/progress";
import { queryKeys } from "@/lib/query/keys";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import type { AttendanceStatus } from "@/lib/types/attendance";

const STATUS_TONE: Record<AttendanceStatus, "leaf" | "sunshine" | "candy"> = {
  present: "leaf",
  late: "sunshine",
  absent: "candy",
};

export function TeacherStudentDetailContent({ studentId }: { studentId: string }) {
  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: queryKeys.student(studentId),
    queryFn: () => getStudent(studentId),
  });

  const { data: attendance } = useQuery({
    queryKey: queryKeys.attendanceRecords(studentId),
    queryFn: () => listAttendance({ studentId }),
  });

  const { data: homework } = useQuery({
    queryKey: queryKeys.homework(student?.className),
    queryFn: () => listHomework({ className: student?.className }),
    enabled: !!student?.className,
  });

  const { data: activityLogs } = useQuery({
    queryKey: queryKeys.activityLogs(studentId),
    queryFn: () => listActivityLogs({ studentId }),
  });

  const { data: progressReports } = useQuery({
    queryKey: queryKeys.progressReports(studentId),
    queryFn: () => listProgressReports({ studentId }),
  });

  if (loadingStudent) {
    return (
      <div>
        <TeacherSubNav />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <TeacherSubNav />
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">Student not found.</p>
        </Card>
      </div>
    );
  }

  const recentAttendance = [...(attendance ?? [])].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 10);
  const presentCount = (attendance ?? []).filter((r) => r.status === "present").length;
  const attendancePct = attendance && attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  return (
    <div>
      <TeacherSubNav />
      <Link href="/teacher/students" className="mb-4 inline-flex items-center gap-1.5 text-sm font-heading text-sky hover:underline">
        <ArrowLeft size={16} /> Back to students
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">{student.fullName}</h1>
        <Badge tone="sky">{student.className}</Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <dl className="space-y-1.5 text-sm text-[#3a2e4d]/70">
            <div className="flex justify-between"><dt>Program</dt><dd>{student.program}</dd></div>
            <div className="flex justify-between"><dt>Date of birth</dt><dd>{new Date(student.dateOfBirth).toLocaleDateString()}</dd></div>
            <div className="flex justify-between"><dt>Blood group</dt><dd>{student.bloodGroup}</dd></div>
            <div className="flex justify-between"><dt>Allergies</dt><dd>{student.allergies || "None"}</dd></div>
            <div className="flex justify-between"><dt>Guardian</dt><dd>{student.guardianName}</dd></div>
            <div className="flex justify-between"><dt>Guardian phone</dt><dd>{student.guardianPhone}</dd></div>
            <div className="flex justify-between"><dt>Emergency contact</dt><dd>{student.emergencyContact.name} ({student.emergencyContact.relationship})</dd></div>
          </dl>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance ({attendancePct}% present)</CardTitle>
          </CardHeader>
          {recentAttendance.length === 0 ? (
            <p className="text-sm text-[#3a2e4d]/60">No attendance recorded yet.</p>
          ) : (
            <ul className="space-y-1.5 text-sm text-[#3a2e4d]/70">
              {recentAttendance.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <span>{new Date(r.date).toLocaleDateString()}</span>
                  <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Homework — {student.className}</CardTitle>
          </CardHeader>
          {!homework || homework.length === 0 ? (
            <p className="text-sm text-[#3a2e4d]/60">No assignments for this class.</p>
          ) : (
            <ul className="space-y-1.5 text-sm text-[#3a2e4d]/70">
              {homework.map((h) => (
                <li key={h.id} className="flex items-center justify-between">
                  <span>{h.title}</span>
                  <Badge tone={h.status === "submitted" ? "leaf" : h.status === "overdue" ? "candy" : "sunshine"}>
                    {h.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Log</CardTitle>
          </CardHeader>
          {!activityLogs || activityLogs.length === 0 ? (
            <p className="text-sm text-[#3a2e4d]/60">No activity logs yet.</p>
          ) : (
            <ul className="space-y-1.5 text-sm text-[#3a2e4d]/70">
              {activityLogs.slice(0, 8).map((a) => (
                <li key={a.id}>
                  <span className="font-semibold">{a.title}</span>
                  <span className="ml-2 text-xs text-[#3a2e4d]/50">
                    {new Date(a.date).toLocaleDateString()} · {a.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Progress Reports</CardTitle>
          </CardHeader>
          {!progressReports || progressReports.length === 0 ? (
            <p className="text-sm text-[#3a2e4d]/60">
              No progress reports yet. <Link href="/teacher/progress" className="text-sky hover:underline">Write one</Link>.
            </p>
          ) : (
            <div className="space-y-4">
              {progressReports.map((r) => (
                <div key={r.id} className="rounded-xl bg-[#faf9ff] p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-heading text-sm font-semibold text-[#3a2e4d]">{r.period}</span>
                    <span className="text-xs text-[#3a2e4d]/50">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-[#3a2e4d]/70">{r.remarks}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {r.milestones.map((m) => (
                      <Badge key={m} tone="leaf" className="text-[10px]">{m}</Badge>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
