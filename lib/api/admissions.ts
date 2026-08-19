// Live Admissions client -- talks to the real Express backend
// (backend/src/controllers/admissionController.ts) via lib/api/client.ts's
// apiFetch. Replaces the previous JSON-mock client that called
// app/api/admissions/**; those route handlers and data/admissions/*.json
// are left in place untouched but no longer imported by any live UI code.
// Function names/signatures unchanged. createApplication intentionally
// does NOT require auth (matches the backend's public POST /admissions,
// used by the anonymous multi-step application form at app/admissions/apply)
// -- apiFetch's `credentials: "include"` just forwards a cookie if one
// happens to exist, it does not require the caller to be logged in.
import { apiFetch } from "@/lib/api/client";
import type { AdmissionApplication, AdmissionStatus, CreateAdmissionInput } from "@/lib/types/admissions";

export async function createApplication(input: CreateAdmissionInput): Promise<AdmissionApplication> {
  return apiFetch<AdmissionApplication>("/admissions", { method: "POST", json: input });
}

export async function listApplications(params?: {
  parentUserId?: string;
  status?: AdmissionStatus;
}): Promise<AdmissionApplication[]> {
  const search = new URLSearchParams();
  if (params?.parentUserId) search.set("parentUserId", params.parentUserId);
  if (params?.status) search.set("status", params.status);
  const qs = search.toString();
  return apiFetch<AdmissionApplication[]>(`/admissions${qs ? `?${qs}` : ""}`, { cache: "no-store" });
}

export async function getApplication(id: string): Promise<AdmissionApplication> {
  return apiFetch<AdmissionApplication>(`/admissions/${id}`, { cache: "no-store" });
}

export async function updateApplicationStatus(
  id: string,
  status: AdmissionStatus,
): Promise<AdmissionApplication> {
  return apiFetch<AdmissionApplication>(`/admissions/${id}/status`, { method: "PATCH", json: { status } });
}
