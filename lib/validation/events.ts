import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(3, "Description is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(2, "Location is required"),
  coverImage: z.string().optional().default(""),
});

export const updateEventSchema = createEventSchema.partial();

export const rsvpSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  guests: z.coerce.number().int().min(0, "Guests cannot be negative").max(20, "Max 20 guests"),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
export type RsvpFormValues = z.infer<typeof rsvpSchema>;
