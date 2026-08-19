"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ChevronLeft, ChevronRight, PartyPopper, BookOpen, IndianRupee } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { listStudents } from "@/lib/api/students";
import { listEvents } from "@/lib/api/events";
import { listHomework } from "@/lib/api/homework";
import { listInvoices } from "@/lib/api/fees";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

type CalendarEntry = {
  id: string;
  title: string;
  kind: "event" | "homework" | "fee";
};

export function ParentCalendarContent() {
  const { user } = useAuth();
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const monthKey = format(monthCursor, "yyyy-MM");

  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id),
    queryFn: () => listStudents({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });
  const student = students?.[0];
  const studentIds = students?.map((s) => s.id) ?? [];

  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: queryKeys.eventsList,
    queryFn: () => listEvents(),
  });

  const { data: homework, isLoading: loadingHomework } = useQuery({
    queryKey: queryKeys.homework(student?.className),
    queryFn: () => listHomework({ className: student!.className }),
    enabled: !!student?.className,
  });

  const { data: invoices, isLoading: loadingInvoices } = useQuery({
    queryKey: queryKeys.invoices(user?.id),
    queryFn: () => listInvoices(),
    enabled: !!students,
  });

  const isLoading = loadingEvents || loadingHomework || loadingInvoices;

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(monthCursor), end: endOfMonth(monthCursor) }),
    [monthCursor],
  );

  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    const push = (date: string, entry: CalendarEntry) => {
      const key = date.slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(entry);
      map.set(key, list);
    };

    (events ?? [])
      .filter((e) => e.date.startsWith(monthKey))
      .forEach((e) => push(e.date, { id: e.id, title: e.title, kind: "event" }));

    (homework ?? [])
      .filter((h) => h.dueDate.startsWith(monthKey))
      .forEach((h) => push(h.dueDate, { id: h.id, title: `Due: ${h.title}`, kind: "homework" }));

    (invoices ?? [])
      .filter((i) => studentIds.includes(i.studentId) && i.dueDate.startsWith(monthKey))
      .forEach((i) => push(i.dueDate, { id: i.id, title: `Fee due: ${i.title}`, kind: "fee" }));

    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, homework, invoices, monthKey]);

  const KIND_TONE = { event: "lavender", homework: "sky", fee: "sunshine" } as const;
  const KIND_ICON = { event: PartyPopper, homework: BookOpen, fee: IndianRupee } as const;

  return (
    <div>
      <ParentSubNav />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Calendar</h1>
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

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge tone="lavender" className="flex items-center gap-1"><PartyPopper size={12} /> School Events</Badge>
        <Badge tone="sky" className="flex items-center gap-1"><BookOpen size={12} /> Homework Due</Badge>
        <Badge tone="sunshine" className="flex items-center gap-1"><IndianRupee size={12} /> Fees Due</Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
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
              const entries = entriesByDate.get(key) ?? [];
              return (
                <div key={key} className="min-h-[6rem] rounded-xl bg-[#faf9ff] p-2 text-xs">
                  <span className="font-heading font-semibold">{format(day, "d")}</span>
                  <div className="mt-1 space-y-1">
                    {entries.map((entry) => {
                      const Icon = KIND_ICON[entry.kind];
                      return (
                        <div
                          key={entry.id}
                          title={entry.title}
                          className={`flex items-center gap-1 truncate rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                            entry.kind === "event"
                              ? "bg-lavender/20 text-purple-700"
                              : entry.kind === "homework"
                                ? "bg-sky/20 text-sky-700"
                                : "bg-sunshine/20 text-yellow-700"
                          }`}
                        >
                          <Icon size={10} /> <span className="truncate">{entry.title}</span>
                        </div>
                      );
                    })}
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
