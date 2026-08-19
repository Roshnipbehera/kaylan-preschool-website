"use client";

// Custom month-grid calendar for the public Events page. Built with
// date-fns (already a dependency, previously unused, added in anticipation
// of this objective). Renders a dot badge on days that have events; clicking
// a day surfaces that day's events via onSelectDay.
import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SchoolEvent } from "@/lib/types/events";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EventCalendar({
  events,
  selectedDay,
  onSelectDay,
}: {
  events: SchoolEvent[];
  selectedDay: Date | null;
  onSelectDay: (day: Date) => void;
}) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, SchoolEvent[]>();
    for (const event of events) {
      const key = format(new Date(event.date), "yyyy-MM-dd");
      map.set(key, [...(map.get(key) ?? []), event]);
    }
    return map;
  }, [events]);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <button
          aria-label="Previous month"
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="rounded-full p-2 hover:bg-lavender/10"
        >
          <ChevronLeft size={20} />
        </button>
        <p className="font-heading text-lg font-semibold text-[#3a2e4d]">{format(month, "MMMM yyyy")}</p>
        <button
          aria-label="Next month"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="rounded-full p-2 hover:bg-lavender/10"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-xs font-heading font-semibold text-[#3a2e4d]/50">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, month);
          const selected = selectedDay ? isSameDay(day, selectedDay) : false;
          return (
            <button
              key={key}
              onClick={() => onSelectDay(day)}
              className={cn(
                "relative flex h-10 flex-col items-center justify-center rounded-xl text-sm transition-colors",
                inMonth ? "text-[#3a2e4d]" : "text-[#3a2e4d]/30",
                selected ? "bg-candy text-white" : "hover:bg-lavender/10",
                isToday(day) && !selected && "font-bold text-candy",
              )}
            >
              {format(day, "d")}
              {dayEvents.length > 0 && (
                <span
                  className={cn(
                    "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                    selected ? "bg-white" : "bg-candy",
                  )}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
