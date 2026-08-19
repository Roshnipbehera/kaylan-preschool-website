// TypeScript interfaces for the Student / Child Profile system. Mirrors the
// shape persisted under data/students/students.json and returned by
// app/api/students/** route handlers. Reuses the guardian/medical shape
// established by lib/types/admissions.ts so the admissions -> enrolled
// student pipeline stays consistent.

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Student {
  id: string;
  parentUserId: string;
  teacherUserId?: string;
  fullName: string;
  dateOfBirth: string; // ISO date
  program: string; // e.g. "Toddler", "Nursery", "Pre-K"
  className: string;
  bloodGroup: string;
  allergies: string;
  photo?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContact: EmergencyContact;
  createdAt: string;
  updatedAt: string;
}

export type UpdateStudentInput = Partial<
  Pick<
    Student,
    | "allergies"
    | "bloodGroup"
    | "photo"
    | "guardianName"
    | "guardianPhone"
    | "guardianEmail"
    | "emergencyContact"
  >
>;
