// Live CMS client -- talks to the real Express backend
// (backend/src/controllers/cmsController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous JSON-mock client that called
// app/api/cms/[section]; those route handlers and data/cms/*.json are left
// in place untouched but no longer imported by any live UI code. Function
// names/signatures unchanged.
import { apiFetch } from "@/lib/api/client";
import type { CmsSectionMap, CmsSectionKey } from "@/lib/types/cms";

export async function getCmsSection<K extends CmsSectionKey>(section: K): Promise<CmsSectionMap[K]> {
  return apiFetch<CmsSectionMap[K]>(`/cms/${section}`, { cache: "no-store" });
}

export async function updateCmsSection<K extends CmsSectionKey>(
  section: K,
  data: CmsSectionMap[K],
): Promise<CmsSectionMap[K]> {
  return apiFetch<CmsSectionMap[K]>(`/cms/${section}`, { method: "PUT", json: data });
}
