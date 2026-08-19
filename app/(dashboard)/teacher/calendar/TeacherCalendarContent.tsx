"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { listStudents } from "@/lib/api/students";
import { listHomework } from "@/lib/api/homework";
import { listEvents } from "@/lib/api/events";
import { queryKeys } from "@/lib/query/keys";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

type CalendarItem = { kind: "event" | "homework"; label: string };

export function TeacherCalendarContent() {
  const { user } = useAuth();
  const [monthCursor, setMonthCursor] = useState(() => new Date());

  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listStudents({ teacherUserId: user?.id }),
    enabled: !!user?.id,
  });

  const { data: homework, isLoading: loadingHomework } = useQuery({
    queryKey: queryKeys.homework(user?.id ? `teacher:${user.id}` : undefined),
    queryFn: () => listHomework({ teacherId: user?.id }),
    enabled: !!user?.id,
  });

  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: queryKeys.eventsList,
    queryFn: () => listEvents(),
  });

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(monthCursor), end: endOfMonth(monthCursor) }),
    [monthCursor],
  );

  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    const add = (date: string, item: CalendarItem) => {
      const key = date.slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), item]);
    };
    (homework ?? []).forEach((h) => add(h.dueDate, { kind: "homework", label: `${h.title} due` }));
    (events ?? []).forEach((e) => add(e.date, { kind: "event", label: e.title }));
    return map;
  }, [homework, events]);

  const isLoading = loadingHomework || loadingEvents;

  return (
    <div>
      <TeacherSubNav />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Calendar — {students?.[0]?.className ?? "My Class"}</h1>
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

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
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
              const items = itemsByDate.get(key) ?? [];
              return (
                <div key={key} className="min-h-[70px] rounded-xl bg-[#faf9ff] p-1.5 text-xs">
                  <span className="font-heading font-semibold">{format(day, "d")}</span>
                  <div className="mt-1 space-y-1">
                    {items.slice(0, 2).map((item, i) => (
                      <Badge key={i} tone={item.kind === "event" ? "sky" : "orange"} className="block w-full truncate px-1.5 py-0.5 text-[9px]">
                        {item.label}
                      </Badge>
                    ))}
                    {items.length > 2 && <p className="text-[9px] text-[#3a2e4d]/40">+{items.length - 2} more</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
