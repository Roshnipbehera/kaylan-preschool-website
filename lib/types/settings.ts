export interface SystemSettings {
  schoolName: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  academicYearStart: string;
  academicYearEnd: string;
  termDates: string;
  maintenanceMode: boolean;
  // Branding / owner-editable identity + contact details (Phase 6).
  logoUrl: string;
  address: string;
  schoolTimings: string;
  admissionsOpen: boolean;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  // Google Maps link for the school location (Phase 7).
  googleMapsUrl: string;
}

// Non-secret subset returned by the public, unauthenticated
// GET /settings/public endpoint (Final Acceptance pass). Used by
// marketing-page components (Contact.tsx, Footer.tsx) that render before
// login and must not call the admin-only GET /settings.
export type PublicSettings = Pick<
  SystemSettings,
  | "contactEmail"
  | "contactPhone"
  | "address"
  | "logoUrl"
  | "schoolTimings"
  | "admissionsOpen"
  | "facebookUrl"
  | "instagramUrl"
  | "twitterUrl"
  | "googleMapsUrl"
>;
