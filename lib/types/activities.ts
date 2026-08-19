// TypeScript interfaces for the Daily Activities system. Mirrors
// data/activities/logs.json and app/api/activities/** route handlers.

export type ActivityCategory = "learning" | "play" | "meal" | "nap" | "art" | "outdoor";

export interface ActivityLog {
  id: string;
  studentId: string;
  date: string; // ISO date (yyyy-mm-dd)
  time: string; // HH:mm
  category: ActivityCategory;
  title: string;
  notes?: string;
  loggedBy: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

export type CreateActivityLogInput = Omit<ActivityLog, "id">;
