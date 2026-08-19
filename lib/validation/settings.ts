import { z } from "zod";

export const systemSettingsSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z.string().min(7, "Enter a valid phone number"),
  currency: z.string().min(1, "Currency is required"),
  academicYearStart: z.string().min(4, "Start date is required"),
  academicYearEnd: z.string().min(4, "End date is required"),
  termDates: z.string().optional().default(""),
  maintenanceMode: z.boolean().default(false),
  logoUrl: z.string().optional().default(""),
  address: z.string().optional().default(""),
  schoolTimings: z.string().optional().default(""),
  admissionsOpen: z.boolean().default(true),
  facebookUrl: z.string().optional().default(""),
  instagramUrl: z.string().optional().default(""),
  twitterUrl: z.string().optional().default(""),
  googleMapsUrl: z.string().optional().default(""),
});

export type SystemSettingsFormValues = z.infer<typeof systemSettingsSchema>;
