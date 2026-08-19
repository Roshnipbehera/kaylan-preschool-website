// Shared TypeScript types used across the frontend (and mirrored, loosely,
// by the backend scaffold in /backend). Keep this the single source of
// truth for the shapes that cross the API boundary.

export type Role = "parent" | "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorShape {
  success: false;
  message: string;
  code?: string;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: Role;
  name: string;
  // Expiry in ms since epoch - MOCK only, a real backend issues a signed JWT.
  exp: number;
}

export interface NotificationPreferences {
  emailUpdates: boolean;
  smsAlerts: boolean;
  weeklyDigest: boolean;
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late";
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  description: string;
}
