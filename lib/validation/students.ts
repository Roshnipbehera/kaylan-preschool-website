import { z } from "zod";

export const emergencyContactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  relationship: z.string().min(2, "Relationship is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

export const updateStudentSchema = z.object({
  bloodGroup: z.string().min(1, "Blood group is required"),
  allergies: z.string().optional().default(""),
  photo: z.string().optional().default(""),
  guardianName: z.string().min(2, "Guardian name is required"),
  guardianPhone: z.string().min(7, "Enter a valid phone number"),
  guardianEmail: z.string().email("Enter a valid email"),
  emergencyContact: emergencyContactSchema,
});

export type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>;

// Admin-only: full student record create/edit (additive -- teacher/parent
// flows continue to use updateStudentSchema above, unchanged).
export const createStudentSchema = z.object({
  parentUserId: z.string().min(1, "Parent is required"),
  teacherUserId: z.string().optional().default(""),
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(4, "Date of birth is required"),
  program: z.string().min(1, "Program is required"),
  className: z.string().min(1, "Class is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  allergies: z.string().optional().default(""),
  photo: z.string().optional().default(""),
  guardianName: z.string().min(2, "Guardian name is required"),
  guardianPhone: z.string().min(7, "Enter a valid phone number"),
  guardianEmail: z.string().email("Enter a valid email"),
  emergencyContact: emergencyContactSchema,
});

export const adminUpdateStudentSchema = createStudentSchema.partial();

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
