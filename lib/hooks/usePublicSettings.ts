"use client";
// Fetches the public, non-secret Settings subset via React Query, mirroring
// useCmsSection.ts's initialData-seed pattern so marketing components have
// zero layout shift on first paint. Backed by the unauthenticated
// GET /settings/public endpoint (backend/src/routes/settingsRoutes.ts).
import { useQuery } from "@tanstack/react-query";
import { getPublicSettings } from "@/lib/api/settings";
import type { PublicSettings } from "@/lib/types/settings";

const SEED: PublicSettings = {
  contactEmail: "kpsdc01@gmail.com",
  contactPhone: "+91 96636 30221",
  address: "30, Near Neo Hospital, Prakruthi Residential Layout, Bettadasanapura, Vittasandra, Bengaluru, Karnataka 560100",
  logoUrl: "/brand/koki-mascot-final.png",
  schoolTimings: "Mon - Fri: 8:30 AM - 3:30 PM (Daycare till 6:30 PM)",
  admissionsOpen: true,
  facebookUrl: "https://facebook.com/kaylanpreschool",
  instagramUrl: "https://www.instagram.com/kaylanpreschoolanddaycare?stkn=MXR5ZXJmc2c4Z202dw==",
  twitterUrl: "https://youtube.com/@kaylanpreschool",
  googleMapsUrl: "https://www.google.com/maps/place/Kaylan+Preschool/@12.8476538,77.6398347,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae6b9b672e8d85:0xd95610aa3ce6c9e2!8m2!3d12.8476486!4d77.6424096",
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
