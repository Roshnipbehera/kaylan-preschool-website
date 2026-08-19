// TypeScript interfaces for the Admission application system. Mirrors the
// JSON persisted under data/admissions/*.json and the shape returned by
// app/api/admissions/** route handlers. Kept in sync with
// backend/src/models/Admission.ts for the Phase 3 backend swap.

export type AdmissionStatus = "submitted" | "under-review" | "accepted" | "rejected" | "waitlisted";

export interface ChildDetails {
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  programApplyingFor: string;
  nationality: string;
}

export interface GuardianInfo {
  fullName: string;
  relation: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
}

export interface MedicalDetails {
  allergies: string;
  conditions: string;
  bloodGroup: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  doctorName: string;
  doctorPhone: string;
}

export interface AdmissionDocuments {
  birthCertificateUrl: string;
  childPhotoUrl: string;
}

export interface AdmissionApplication {
  id: string;
  parentUserId?: string;
  child: ChildDetails;
  guardian: GuardianInfo;
  medical: MedicalDetails;
  documents: AdmissionDocuments;
  status: AdmissionStatus;
  submittedAt: string;
  updatedAt: string;
}

export type CreateAdmissionInput = Omit<AdmissionApplication, "id" | "status" | "submittedAt" | "updatedAt">;
