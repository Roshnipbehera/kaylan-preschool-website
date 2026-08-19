import multer from "multer";

const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024);

const ALLOWED_MIME_PREFIXES = ["image/", "application/pdf", "video/", "audio/"];

export const messageAttachmentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 5 },
  fileFilter: (_req, file, cb) => {
    const allowed = ALLOWED_MIME_PREFIXES.some((prefix) => file.mimetype.startsWith(prefix));
    if (!allowed) return cb(new Error(`Unsupported file type: ${file.mimetype}`));
    cb(null, true);
  },
});
