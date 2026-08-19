import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["parent", "teacher", "admin"]),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^[0-9+\-\s]{7,15}$/.test(v), "Enter a valid phone number"),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const settingsSchema = z.object({
  emailUpdates: z.boolean(),
  smsAlerts: z.boolean(),
  weeklyDigest: z.boolean(),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
