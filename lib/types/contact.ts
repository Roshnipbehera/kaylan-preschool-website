// TypeScript interfaces for the public "Find Us" contact enquiry form
// (components/Contact.tsx). Mirrors backend/src/controllers/contactController.ts's
// toContactInquiryDto() shape 1:1, same convention as lib/types/admissions.ts.

export interface ContactInquiry {
  id: string;
  parentName: string;
  phone: string;
  message: string;
  submittedAt: string;
}

export type CreateContactInquiryInput = Omit<ContactInquiry, "id" | "submittedAt">;
