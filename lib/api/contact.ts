// Live Contact-enquiry client -- talks to the real Express backend
// (backend/src/controllers/contactController.ts) via lib/api/client.ts's
// apiFetch, same pattern as lib/api/admissions.ts. createContactInquiry is
// public/unauthenticated (matches the backend's public POST /contact, used
// by the anonymous "Find Us" enquiry form on the marketing homepage).
import { apiFetch } from "@/lib/api/client";
import type { ContactInquiry, CreateContactInquiryInput } from "@/lib/types/contact";

export async function createContactInquiry(input: CreateContactInquiryInput): Promise<ContactInquiry> {
  return apiFetch<ContactInquiry>("/contact", { method: "POST", json: input });
}
