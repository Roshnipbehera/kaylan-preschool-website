"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, Users } from "lucide-react";
import { createEvent, deleteEvent, listEvents, listRsvps, updateEvent } from "@/lib/api/events";
import { createEventSchema, type CreateEventFormValues } from "@/lib/validation/events";
import { queryKeys } from "@/lib/query/keys";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SchoolEvent } from "@/lib/types/events";

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EventForm({ existing, onDone }: { existing?: SchoolEvent; onDone: () => void }) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: existing
      ? {
          title: existing.title,
          description: existing.description,
          date: toLocalInputValue(existing.date),
          location: existing.location,
          coverImage: existing.coverImage ?? "",
        }
      : { title: "", description: "", date: "", location: "", coverImage: "" },
  });

  const onSubmit = async (values: CreateEventFormValues) => {
    setSubmitting(true);
    try {
      const isoDate = new Date(values.date).toISOString();
      if (existing) {
        await updateEvent(existing.id, { ...values, date: isoDate });
        toast.success("Event updated.");
      } else {
        await createEvent({ ...values, date: isoDate });
        toast.success("Event created.");
      }
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <FormField>
        <Input label="Title" {...register("title")} error={errors.title?.message} />
      </FormField>
      <FormField>
        <Input label="Date & Time" type="datetime-local" {...register("date")} error={errors.date?.message} />
      </FormField>
      <FormField>
        <Input label="Location" {...register("location")} error={errors.location?.message} />
      </FormField>
      <FormField>
        <Input label="Cover Image URL" {...register("coverImage")} error={errors.coverImage?.message} />
      </FormField>
      <FormField className="sm:col-span-2">
        <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 text-sm focus:border-candy focus:outline-none focus:ring-2 focus:ring-candy"
        />
        {errors.description && <p className="mt-1 text-xs font-semibold text-red-500">{errors.description.message}</p>}
      </FormField>
      <div className="sm:col-span-2 flex justify-end">
        <Button type="submit" isLoading={submitting}>
          {existing ? "Save Changes" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}

function RsvpList({ eventId }: { eventId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.eventRsvps(eventId),
    queryFn: () => listRsvps(eventId),
  });

  if (isLoading) return <Skeleton className="h-16 w-full" />;
  if (!data || data.length === 0) return <p className="text-sm text-[#3a2e4d]/60">No RSVPs yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 text-xs uppercase text-[#3a2e4d]/50">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Guests</th>
            <th className="py-2 pr-4">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id} className="border-b border-black/5">
              <td className="py-2 pr-4">{r.name}</td>
              <td className="py-2 pr-4">{r.email}</td>
              <td className="py-2 pr-4">{r.guests}</td>
              <td className="py-2 pr-4">{format(new Date(r.submittedAt), "MMM d, yyyy h:mm a")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventRow({ event, onChanged }: { event: SchoolEvent; onChanged: () => void }) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [showRsvps, setShowRsvps] = useState(false);

  const remove = async () => {
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent(event.id);
      toast.success("Event deleted.");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-heading font-semibold">{event.title}</p>
          <p className="text-xs text-[#3a2e4d]/60">
            {format(new Date(event.date), "MMM d, yyyy h:mm a")} · {event.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowRsvps((v) => !v)}>
            <Users size={16} className="mr-1" /> RSVPs {showRsvps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditing((v) => !v)}>
            <Pencil size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={remove}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {editing && (
        <div className="mt-4 border-t border-black/5 pt-4">
          <EventForm
            existing={event}
            onDone={() => {
              setEditing(false);
              onChanged();
            }}
          />
        </div>
      )}

      {showRsvps && (
        <div className="mt-4 border-t border-black/5 pt-4">
          <RsvpList eventId={event.id} />
        </div>
      )}
    </Card>
  );
}

export function AdminEventsContent() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: queryKeys.eventsList, queryFn: listEvents });

  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.eventsList });

  const events = useMemo(
    () => (data ?? []).slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [data],
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Events</h1>
        <Button onClick={() => setCreating((v) => !v)}>
          <Plus size={16} className="mr-1" /> {creating ? "Cancel" : "New Event"}
        </Button>
      </div>

      {creating && (
        <Card className="mb-8">
          <h2 className="mb-4 font-heading text-lg font-semibold text-[#3a2e4d]">Create New Event</h2>
          <EventForm
            onDone={() => {
              setCreating(false);
              refresh();
            }}
          />
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No events yet. Create your first event above.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <EventRow key={event.id} event={event} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
