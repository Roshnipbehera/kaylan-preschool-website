import { z } from "zod";

export const childDetailsSchema = z.object({
  fullName: z.string().min(2, "Child's full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  programApplyingFor: z.string().min(1, "Please select a program"),
  nationality: z.string().min(2, "Nationality is required"),
});

export const guardianInfoSchema = z.object({
  fullName: z.string().min(2, "Guardian's full name is required"),
  relation: z.string().min(2, "Relation is required"),
  phone: z.string().min(7, "A valid phone number is required"),
  email: z.string().email("A valid email is required"),
  occupation: z.string().min(2, "Occupation is required"),
  address: z.string().min(5, "Address is required"),
});

export const medicalDetailsSchema = z.object({
  allergies: z.string().default(""),
  conditions: z.string().default(""),
  bloodGroup: z.string().min(1, "Blood group is required"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(7, "Emergency contact phone is required"),
  doctorName: z.string().default(""),
  doctorPhone: z.string().default(""),
});

export const admissionDocumentsSchema = z.object({
  birthCertificateUrl: z.string().min(1, "Please upload the birth certificate"),
  childPhotoUrl: z.string().min(1, "Please upload a child photo"),
});

export const createAdmissionSchema = z.object({
  parentUserId: z.string().optional(),
  child: childDetailsSchema,
  guardian: guardianInfoSchema,
  medical: medicalDetailsSchema,
  documents: admissionDocumentsSchema,
});

export const updateAdmissionStatusSchema = z.object({
  status: z.enum(["submitted", "under-review", "accepted", "rejected", "waitlisted"]),
});

export type CreateAdmissionFormValues = z.infer<typeof createAdmissionSchema>;
