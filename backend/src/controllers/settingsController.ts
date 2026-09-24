import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { logAudit } from "../lib/audit";

// Live System Settings (Batch 4 migration pass). Replaces app/api/settings
// (JSON-backed, data/settings/system.json). Single-row-ish: persisted as
// one SystemSetting row keyed "system". Response shape mirrors
// lib/types/settings.ts's SystemSettings exactly.

const SETTINGS_KEY = "system";

const settingsSchema = z.object({
  schoolName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
  currency: z.string().min(1),
  academicYearStart: z.string(),
  academicYearEnd: z.string(),
  termDates: z.string(),
  maintenanceMode: z.boolean(),
  logoUrl: z.string().optional().default(""),
  address: z.string().optional().default(""),
  schoolTimings: z.string().optional().default(""),
  admissionsOpen: z.boolean().optional().default(true),
  facebookUrl: z.string().optional().default(""),
  instagramUrl: z.string().optional().default(""),
  twitterUrl: z.string().optional().default(""),
  googleMapsUrl: z.string().optional().default(""),
});

const DEFAULTS = {
  schoolName: "Kaylan Preschool",
  contactEmail: "kpsdc01@gmail.com",
  contactPhone: "+91 96636 30221",
  currency: "INR",
  academicYearStart: "2026-06-01",
  academicYearEnd: "2027-03-31",
  termDates: "Term 1: Jun - Sep · Term 2: Oct - Dec · Term 3: Jan - Mar",
  maintenanceMode: false,
  logoUrl: "/brand/koki-mascot-final.png",
  address: "30, Near Neo Hospital, Prakruthi Residential Layout, Bettadasanapura, Vittasandra, Bengaluru, Karnataka 560100",
  schoolTimings: "Mon - Fri: 8:30 AM - 3:30 PM (Daycare till 6:30 PM)",
  admissionsOpen: true,
  facebookUrl: "https://facebook.com/kaylanpreschool",
  instagramUrl: "https://www.instagram.com/kaylanpreschoolanddaycare?stkn=MXR5ZXJmc2c4Z202dw==",
  twitterUrl: "https://youtube.com/@kaylanpreschool",
  googleMapsUrl: "https://www.google.com/maps/place/Kaylan+Preschool/@12.8476538,77.6398347,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae6b9b672e8d85:0xd95610aa3ce6c9e2!8m2!3d12.8476486!4d77.6424096",
};

export async function getSettings(_req: Request, res: Response) {
  const row = await prisma.systemSetting.findUnique({ where: { key: SETTINGS_KEY } });
  // Merge with DEFAULTS so settings rows persisted before the branding
  // fields (logoUrl/address/schoolTimings/admissionsOpen/social links) were
  // added still return a complete SystemSettings shape to the client.
  res.json({ success: true, data: row ? { ...DEFAULTS, ...(row.value as object) } : DEFAULTS });
}

// Public, unauthenticated subset -- only non-secret branding/contact
// fields, safe to expose to the marketing site (Contact.tsx, Footer.tsx).
// Mirrors getSettings' DEFAULTS-merge behaviour for backward compatibility.
export async function getPublicSettings(_req: Request, res: Response) {
  const row = await prisma.systemSetting.findUnique({ where: { key: SETTINGS_KEY } });
  const merged = row ? { ...DEFAULTS, ...(row.value as object) } : DEFAULTS;
  const {
    contactEmail,
    contactPhone,
    address,
    logoUrl,
    schoolTimings,
    admissionsOpen,
    facebookUrl,
    instagramUrl,
    twitterUrl,
    googleMapsUrl,
  } = merged as typeof DEFAULTS;
  res.json({
    success: true,
    data: {
      contactEmail,
      contactPhone,
      address,
      logoUrl,
      schoolTimings,
      admissionsOpen,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      googleMapsUrl,
    },
  });
}

export async function saveSettings(req: Request, res: Response) {
  const data = settingsSchema.parse(req.body);
  const row = await prisma.systemSetting.upsert({
    where: { key: SETTINGS_KEY },
    create: { key: SETTINGS_KEY, value: data as never },
    update: { value: data as never },
  });
  await logAudit(req, { action: "System settings updated", category: "settings", entity: "SystemSetting", entityId: row.key });
  res.json({ success: true, data: row.value });
}
