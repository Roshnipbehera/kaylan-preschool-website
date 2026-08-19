// MOCK Cloudinary upload. Mirrors the shape of the real endpoint that will
// be implemented server-side in backend/src/controllers/userController.ts
// (multer -> Cloudinary via backend/src/config/cloudinary.ts). To go live,
// replace the body of uploadAvatar with either:
//   1) a signed upload: apiFetch('/users/me/avatar', { method: 'POST', body: formData })
//   2) an unsigned direct-to-Cloudinary upload using an upload preset.

import { mockDelay, USE_MOCK_API } from "@/lib/api/client";

export async function uploadAvatar(file: File): Promise<{ url: string }> {
  if (!USE_MOCK_API) {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/upload-proxy", { method: "POST", body: formData });
    return res.json();
  }

  await mockDelay(1200);
  // Fake but realistic-looking Cloudinary secure_url for demo purposes.
  const seed = encodeURIComponent(file.name).slice(0, 20);
  return { url: `https://res.cloudinary.com/kaylan-demo/image/upload/v1/mock-avatars/${seed}` };
}

// MOCK Cloudinary upload for admission documents (birth certificate PDF/image,
// child photo). Same shape/behavior as uploadAvatar -- swap for a real
// signed/unsigned Cloudinary upload in Phase 3.
export async function uploadAdmissionDocument(
  file: File,
  kind: "birth-certificate" | "child-photo",
): Promise<{ url: string }> {
  if (!USE_MOCK_API) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);
    const res = await fetch("/api/upload-proxy", { method: "POST", body: formData });
    return res.json();
  }

  await mockDelay(1000);
  const resourceType = file.type === "application/pdf" ? "raw" : "image";
  const seed = encodeURIComponent(file.name).slice(0, 30);
  return {
    url: `https://res.cloudinary.com/kaylan-demo/${resourceType}/upload/v1/mock-admissions/${kind}-${seed}`,
  };
}


// MOCK Cloudinary upload for gallery images. Same shape/behavior as
// uploadAvatar/uploadAdmissionDocument -- swap for a real signed/unsigned
// Cloudinary upload in Phase 3.
export async function uploadGalleryImage(file: File): Promise<{ url: string }> {
  if (!USE_MOCK_API) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload-proxy", { method: "POST", body: formData });
    return res.json();
  }

  await mockDelay(1100);
  const seed = encodeURIComponent(file.name).slice(0, 30);
  return { url: `https://res.cloudinary.com/kaylan-demo/image/upload/v1/mock-gallery/${seed}` };
}

// MOCK Cloudinary upload for Teacher Dashboard daily-activity attachments
// (photo/video taken during class). Same shape/behavior as
// uploadGalleryImage -- swap for a real signed/unsigned Cloudinary upload
// in Phase 3. Detects resource type from the file's MIME type so callers
// can persist ActivityLog.mediaType alongside the returned URL.
export async function uploadTeacherMedia(file: File): Promise<{ url: string; type: "image" | "video" }> {
  const type: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
  if (!USE_MOCK_API) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload-proxy", { method: "POST", body: formData });
    const data = await res.json();
    return { ...data, type };
  }

  await mockDelay(1200);
  const seed = encodeURIComponent(file.name).slice(0, 30);
  const resourceType = type === "video" ? "video" : "image";
  return {
    url: `https://res.cloudinary.com/kaylan-demo/${resourceType}/upload/v1/mock-activities/${seed}`,
    type,
  };
}
