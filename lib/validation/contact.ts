import { z } from "zod";

// Same validation style/conventions as lib/validation/admissions.ts.
export const createContactInquirySchema = z.object({
  parentName: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "A valid phone number is required"),
  message: z.string().min(5, "Please tell us a little about your enquiry"),
});

export type CreateContactInquiryFormValues = z.infer<typeof createContactInquirySchema>;
