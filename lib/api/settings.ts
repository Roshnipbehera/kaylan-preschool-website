// Live Settings client -- talks to the real Express backend
// (backend/src/controllers/settingsController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous client that called app/api/settings
// (JSON-backed, data/settings/system.json); that route handler and data
// file are left in place untouched but no longer imported by any live UI
// code.
import { apiFetch } from "@/lib/api/client";
import type { SystemSettings, PublicSettings } from "@/lib/types/settings";

export async function getSettings(): Promise<SystemSettings> {
  return apiFetch<SystemSettings>("/settings", { cache: "no-store" });
}

// Public, unauthenticated -- backend/src/routes/settingsRoutes.ts's
// GET /settings/public. Safe to call from marketing pages (Contact.tsx,
// Footer.tsx) that render before login.
export async function getPublicSettings(): Promise<PublicSettings> {
  return apiFetch<PublicSettings>("/settings/public", { cache: "no-store" });
}

export async function saveSettings(input: SystemSettings): Promise<SystemSettings> {
  return apiFetch<SystemSettings>("/settings", { method: "PUT", json: input });
}
