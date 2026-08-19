"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rsvpSchema, type RsvpFormValues } from "@/lib/validation/events";
import { submitRsvp } from "@/lib/api/events";
import { useToast } from "@/lib/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

export function RsvpForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { eventId, name: "", email: "", guests: 0 },
  });

  const onSubmit = async (values: RsvpFormValues) => {
    setSubmitting(true);
    try {
      await submitRsvp(eventId, { name: values.name, email: values.email, guests: values.guests });
      toast.success(`RSVP confirmed for ${eventTitle}! Check your inbox for a confirmation.`);
      setDone(true);
      reset({ eventId, name: "", email: "", guests: 0 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit RSVP");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <p className="rounded-2xl bg-leaf/10 px-4 py-3 text-sm font-heading font-semibold text-green-700">
        You&apos;re on the list! We sent a confirmation email your way. 🎉
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...register("eventId")} value={eventId} />
      <FormField className="mb-0">
        <Input label="Your Name" {...register("name")} error={errors.name?.message} />
      </FormField>
      <FormField className="mb-0">
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      </FormField>
      <FormField className="mb-0">
        <Input label="Number of Guests" type="number" min={0} max={20} {...register("guests")} error={errors.guests?.message} />
      </FormField>
      <Button type="submit" isLoading={submitting} className="w-full">
        RSVP Now
      </Button>
    </form>
  );
}
