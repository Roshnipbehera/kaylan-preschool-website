"use client";
// Fetches the public, non-secret Settings subset via React Query, mirroring
// useCmsSection.ts's initialData-seed pattern so marketing components have
// zero layout shift on first paint. Backed by the unauthenticated
// GET /settings/public endpoint (backend/src/routes/settingsRoutes.ts).
import { useQuery } from "@tanstack/react-query";
import { getPublicSettings } from "@/lib/api/settings";
import type { PublicSettings } from "@/lib/types/settings";

const SEED: PublicSettings = {
  contactEmail: "admissions@kaylanpreschool.com",
  contactPhone: "+91 98860 12345",
  address: "Plot #14, NeoTown Rd, Electronic City Phase 1, Bangalore 560100",
  logoUrl: "/brand/koki-mascot-final.png",
  schoolTimings: "Mon - Fri: 8:30 AM - 3:30 PM (Daycare till 6:30 PM)",
  admissionsOpen: true,
  facebookUrl: "https://facebook.com/kaylanpreschool",
  instagramUrl: "https://instagram.com/kaylanpreschool",
  twitterUrl: "https://youtube.com/@kaylanpreschool",
  googleMapsUrl: "https://maps.google.com/?q=Electronic+City+Phase+1+Bangalore",
};

export function usePublicSettings() {
  const query = useQuery({
    queryKey: ["public-settings"],
    queryFn: getPublicSettings,
    initialData: () => SEED,
    staleTime: 60_000,
  });
  return query as typeof query & { data: PublicSettings };
}
