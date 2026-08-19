// TypeScript interfaces for the parent Document Center. Mirrors
// data/downloads/documents.json. Fee receipts and admission receipts are
// generated client-side via jsPDF (lib/pdf/*) and are not persisted here --
// this store is for admin-uploaded static documents.

export interface DownloadDocument {
  id: string;
  title: string;
  category: "circular" | "guideline" | "calendar" | "other";
  url: string;
  uploadedAt: string; // ISO date
}
