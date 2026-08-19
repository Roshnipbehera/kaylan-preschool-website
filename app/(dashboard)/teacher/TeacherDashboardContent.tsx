"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Users, CalendarCheck, BookOpen, MessageCircle, CalendarDays } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { listStudents } from "@/lib/api/students";
import { listAttendance } from "@/lib/api/attendance";
import { listHomework } from "@/lib/api/homework";
import { listConversations } from "@/lib/api/messaging";
import { listEvents } from "@/lib/api/events";
import { queryKeys } from "@/lib/query/keys";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export function TeacherDashboardContent() {
  const { user } = useAuth();
  const todayKey = format(new Date(), "yyyy-MM-dd");

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: queryKeys.students(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listStudents({ teacherUserId: user?.id }),
    enabled: !!user?.id,
  });

  const classNames = useMemo(() => Array.from(new Set((students ?? []).map((s) => s.className))), [students]);

  const { data: todaysAttendance } = useQuery({
    queryKey: queryKeys.teacherAttendance(classNames.join(","), todayKey),
    queryFn: () => listAttendance({ date: todayKey }),
    enabled: (students?.length ?? 0) > 0,
  });

  const { data: homework } = useQuery({
    queryKey: queryKeys.homework(classNames.join(",") || "all"),
    queryFn: () => listHomework({ teacherId: user?.id }),
    enabled: !!user?.id,
  });

  // Real backend's GET /conversations already returns per-conversation
  // unreadCount (backend/src/controllers/conversationController.ts), so no
  // separate per-conversation message fetch is needed here anymore.
  const { data: conversations } = useQuery({
    queryKey: queryKeys.conversations(user?.id),
    queryFn: () => listConversations(),
    enabled: !!user?.id,
  });

  const { data: events } = useQuery({
    queryKey: queryKeys.eventsList,
    queryFn: () => listEvents(),
  });

  const notYetMarked = (students ?? []).filter(
    (s) => !(todaysAttendance ?? []).some((r) => r.studentId === s.id),
  ).length;

  const pendingGrading = (homework ?? []).filter((h) => h.status === "pending" || h.status === "overdue").length;

  const unreadMessages = (conversations ?? []).reduce((sum, c) => sum + c.unreadCount, 0);

  const upcomingEvents = (events ?? [])
    .filter((e) => new Date(e.date).getTime() >= Date.now())
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 3);

  const isLoading = loadingStudents;

  return (
    <div>
      <TeacherSubNav />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/teacher/students">
            <Card className="h-full transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <Users className="text-sky" />
                <div>
                  <p className="text-2xl font-bold text-[#3a2e4d]">{students?.length ?? 0}</p>
                  <p className="text-xs text-[#3a2e4d]/60">Students in {classNames.join(", ") || "your class"}</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/teacher/attendance">
            <Card className="h-full transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <CalendarCheck className="text-leaf" />
                <div>
                  <p className="text-2xl font-bold text-[#3a2e4d]">{notYetMarked}</p>
                  <p className="text-xs text-[#3a2e4d]/60">Not yet marked today</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/teacher/assignments">
            <Card className="h-full transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <BookOpen className="text-orange" />
                <div>
                  <p className="text-2xl font-bold text-[#3a2e4d]">{pendingGrading}</p>
                  <p className="text-xs text-[#3a2e4d]/60">Assignments pending/overdue</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/teacher/messages">
            <Card className="h-full transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <MessageCircle className="text-candy" />
                <div>
                  <p className="text-2xl font-bold text-[#3a2e4d]">{unreadMessages}</p>
                  <p className="text-xs text-[#3a2e4d]/60">Unread messages</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Classroom</CardTitle>
          </CardHeader>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : students && students.length > 0 ? (
            <ul className="space-y-2 text-sm text-[#3a2e4d]/70">
              {students.map((s) => (
                <li key={s.id} className="flex items-center justify-between">
                  <Link href={`/teacher/students/${s.id}`} className="hover:text-sky hover:underline">
                    {s.fullName}
                  </Link>
                  <Badge tone="sky">{s.className}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#3a2e4d]/60">No students assigned yet.</p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays size={18} /> Upcoming Events
            </CardTitle>
          </CardHeader>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-[#3a2e4d]/60">No upcoming events.</p>
          ) : (
            <ul className="space-y-2 text-sm text-[#3a2e4d]/70">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between">
                  <span>{e.title}</span>
                  <span className="text-xs text-[#3a2e4d]/50">{format(new Date(e.date), "d MMM")}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
