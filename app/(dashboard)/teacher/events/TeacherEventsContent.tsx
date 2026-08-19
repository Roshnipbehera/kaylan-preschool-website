"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Users } from "lucide-react";
import { listEvents, listRsvps } from "@/lib/api/events";
import { queryKeys } from "@/lib/query/keys";
import { TeacherSubNav } from "@/components/teacher/TeacherSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export function TeacherEventsContent() {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: queryKeys.eventsList,
    queryFn: () => listEvents(),
  });

  const { data: rsvps, isLoading: loadingRsvps } = useQuery({
    queryKey: queryKeys.eventRsvps(expandedEventId ?? ""),
    queryFn: () => listRsvps(expandedEventId!),
    enabled: !!expandedEventId,
  });

  const sorted = [...(events ?? [])].sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div>
      <TeacherSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">School Events</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No events scheduled.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sorted.map((e) => (
            <Card key={e.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardHeader className="mb-1">
                    <CardTitle className="text-lg">{e.title}</CardTitle>
                  </CardHeader>
                  <p className="text-sm text-[#3a2e4d]/60">{e.description}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#3a2e4d]/50">
                    <MapPin size={12} /> {e.location}
                  </p>
                  <Badge tone="sky" className="mt-2">
                    {new Date(e.date).toLocaleString()}
                  </Badge>
                </div>
                <button
                  onClick={() => setExpandedEventId(expandedEventId === e.id ? null : e.id)}
                  className="flex items-center gap-1.5 rounded-full border-2 border-sky px-3 py-1.5 text-xs font-heading font-semibold text-sky hover:bg-sky/10"
                >
                  <Users size={14} /> {expandedEventId === e.id ? "Hide RSVPs" : "View RSVPs"}
                </button>
              </div>

              {expandedEventId === e.id && (
                <div className="mt-4 border-t border-black/5 pt-4">
                  {loadingRsvps ? (
                    <Skeleton className="h-16 w-full" />
                  ) : !rsvps || rsvps.length === 0 ? (
                    <p className="text-sm text-[#3a2e4d]/50">No RSVPs yet.</p>
                  ) : (
                    <ul className="space-y-1.5 text-sm text-[#3a2e4d]/70">
                      {rsvps.map((r) => (
                        <li key={r.id} className="flex items-center justify-between">
                          <span>{r.name} ({r.email})</span>
                          <span className="text-xs text-[#3a2e4d]/50">{r.guests} guest(s)</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
