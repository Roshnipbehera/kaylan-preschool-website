import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["parent", "teacher", "admin"]),
  className: z.string().optional(),
  subject: z.string().optional(),
  linkedStudentIds: z.array(z.string()).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  className: z.string().optional(),
  subject: z.string().optional(),
  linkedStudentIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
