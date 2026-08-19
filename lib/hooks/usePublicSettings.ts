"use client";
// Fetches the public, non-secret Settings subset via React Query, mirroring
// useCmsSection.ts's initialData-seed pattern so marketing components have
// zero layout shift on first paint. Backed by the unauthenticated
// GET /settings/public endpoint (backend/src/routes/settingsRoutes.ts).
import { useQuery } from "@tanstack/react-query";
import { getPublicSettings } from "@/lib/api/settings";
import type { PublicSettings } from "@/lib/types/settings";

const SEED: PublicSettings = {
  contactEmail: "hello@kaylanpreschool.com",
  contactPhone: "+91 00000 00000",
  address: "Electronic City, Bangalore",
  logoUrl: "",
  schoolTimings: "Mon-Fri, 9:00 AM - 3:00 PM",
  admissionsOpen: true,
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  googleMapsUrl: "",
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
