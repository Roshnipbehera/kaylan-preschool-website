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
  CLIENT_URL: z.string().default("https://kaylan-preschool-website.vercel.app"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_ACCESS_SECRET: z.string().min(16).default("kaylan_super_secret_jwt_access_key_2026_xyz"),
  JWT_REFRESH_SECRET: z.string().min(16).default("kaylan_super_secret_jwt_refresh_key_2026_abc"),
  JWT_ACCESS_EXPIRES_IN: z.string().optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  MAX_UPLOAD_BYTES: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
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
