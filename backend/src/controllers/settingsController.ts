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
  contactEmail: "info@kaylanpreschool.school",
  contactPhone: "+91 98765 00000",
  currency: "INR",
  academicYearStart: "2026-06-01",
  academicYearEnd: "2027-03-31",
  termDates: "Term 1: Jun-Sep - Term 2: Oct-Dec - Term 3: Jan-Mar",
  maintenanceMode: false,
  logoUrl: "",
  address: "",
  schoolTimings: "Mon-Fri, 9:00 AM - 3:00 PM",
  admissionsOpen: true,
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  googleMapsUrl: "",
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
