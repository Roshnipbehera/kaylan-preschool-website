import { z } from "zod";

// Fail-fast startup validation. Previously, a missing JWT_ACCESS_SECRET (say)
// would only surface confusingly at first login attempt (jsonwebtoken
// throwing deep in signAccessToken); now the server refuses to boot at all
// with a clear list of what's missing, matching the same "fail fast on
// unreachable DATABASE_URL" philosophy already used in server.ts's
// prisma.$connect() call.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().optional(),
  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  SMTP_FROM: z.string().min(1, "SMTP_FROM is required"),

  MAX_UPLOAD_BYTES: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error("[env] Invalid/missing environment variables:\n");
    for (const issue of result.error.issues) {
      // eslint-disable-next-line no-console
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    // eslint-disable-next-line no-console
    console.error("\nCheck backend/.env against backend/.env.example.");
    process.exit(1);
  }

  if (result.data.JWT_ACCESS_SECRET === result.data.JWT_REFRESH_SECRET) {
    // eslint-disable-next-line no-console
    console.error("[env] JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values.");
    process.exit(1);
  }

  return result.data;
}
