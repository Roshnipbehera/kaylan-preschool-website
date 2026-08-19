// TypeScript interfaces for the Announcements system. Mirrors
// data/announcements/announcements.json.

export type AnnouncementAudience = "all" | "parents" | "teachers";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string; // ISO date
  audience: AnnouncementAudience;
  classId?: string;
  createdBy?: string;
}

export type CreateAnnouncementInput = Omit<Announcement, "id">;
