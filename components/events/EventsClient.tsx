"use client";

import { useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EventCalendar } from "@/components/events/EventCalendar";
import { EventCountdown } from "@/components/events/EventCountdown";
import { RsvpForm } from "@/components/events/RsvpForm";
import type { SchoolEvent } from "@/lib/types/events";

export function EventsClient({ events }: { events: SchoolEvent[] }) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const dayEvents = useMemo(
    () => (selectedDay ? events.filter((e) => isSameDay(new Date(e.date), selectedDay)) : []),
    [events, selectedDay],
  );

  const upcoming = useMemo(
    () => [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events],
  );

  return (
    <div className="space-y-10">
      <EventCountdown events={events} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <EventCalendar events={events} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

        <div>
          <h2 className="mb-4 font-heading text-lg font-semibold text-[#3a2e4d]">
            {selectedDay ? `Events on ${format(selectedDay, "MMMM d, yyyy")}` : "All Upcoming Events"}
          </h2>
          <div className="space-y-4">
            {(selectedDay ? dayEvents : upcoming).length === 0 ? (
              <Card>
                <p className="text-sm text-[#3a2e4d]/60">
                  {selectedDay ? "No events on this day." : "No events scheduled yet."}
                </p>
              </Card>
            ) : (
              (selectedDay ? dayEvents : upcoming).map((event) => (
                <Card key={event.id}>
                  <p className="font-heading font-semibold text-[#3a2e4d]">{event.title}</p>
                  <p className="mb-1 text-xs text-[#3a2e4d]/60">
                    {format(new Date(event.date), "EEE, MMM d, yyyy · h:mm a")}
                  </p>
                  <p className="mb-2 flex items-center gap-1 text-xs text-[#3a2e4d]/60">
                    <MapPin size={12} /> {event.location}
                  </p>
                  <p className="mb-4 text-sm text-[#5b4b6b]">{event.description}</p>
                  <RsvpForm eventId={event.id} eventTitle={event.title} />
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
