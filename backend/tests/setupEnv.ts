// Loaded by jest.config.js's setupFiles before any test module is imported,
// so process.env is populated before backend/src/config/env.ts (and any
// module that reads process.env at import time, e.g. utils/token.ts) runs.
process.env.NODE_ENV = "test";
process.env.CLIENT_URL = "http://localhost:3000";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/kaylan_test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-please-ignore-me";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-please-ignore";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "30d";
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "test-key";
process.env.CLOUDINARY_API_SECRET = "test-secret";
process.env.SMTP_HOST = "smtp.test.local";
process.env.SMTP_PORT = "587";
process.env.SMTP_USER = "test@test.local";
process.env.SMTP_PASS = "test-pass";
process.env.SMTP_FROM = "Kaylan Preschool <no-reply@test.local>";
