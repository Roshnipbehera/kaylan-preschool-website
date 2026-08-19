import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  refreshTokenExpiryDate,
  generateRandomToken,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
} from "../utils/token";
import { sendMail, verificationEmailTemplate, passwordResetEmailTemplate } from "../config/nodemailer";

const publicUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  isEmailVerified: true,
  avatarUrl: true,
  createdAt: true,
} as const;

async function issueSession(res: Response, user: { id: string; name: string; email: string; role: any }) {
  const accessToken = signAccessToken(user);
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: hashToken(refreshToken), expiresAt: refreshTokenExpiryDate() },
  });

  res.cookie(ACCESS_COOKIE_NAME, accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
  return { accessToken, refreshToken };
}

// --- register (admin-created accounts are seeded; this endpoint exists for
// parity with the real backend contract and for future self-serve signup) --

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["PARENT", "TEACHER", "ADMIN"]).default("PARENT"),
});

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("An account with that email already exists", 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const emailVerificationToken = generateRandomToken();

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role, emailVerificationToken },
    select: publicUser,
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;
  await sendMail(email, "Verify your Kaylan Preschool account", verificationEmailTemplate(name, verifyUrl));

  res.status(201).json({ success: true, data: user, message: "Registered. Check your email to verify your account." });
}

// --- login: password check -> access token (short-lived, cookie + body)
// + refresh token (long-lived, httpOnly cookie only, rotated on every use) --

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["parent", "teacher", "admin"]).transform((r) => r.toUpperCase() as "PARENT" | "TEACHER" | "ADMIN"),
});

export async function login(req: Request, res: Response) {
  const { email, password, role } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.role !== role) throw new AppError("Invalid email, password, or role", 401);

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new AppError("Invalid email, password, or role", 401);

  const { accessToken } = await issueSession(res, user);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      token: accessToken,
    },
  });
}

// --- refresh: rotates the refresh token (old one revoked, new one issued)
// and mints a new short-lived access token. ---------------------------------

export async function refresh(req: Request, res: Response) {
  const raw = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!raw) throw new AppError("No refresh token", 401);

  const tokenHash = hashToken(raw);
  const record = await prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
  if (!record || record.revokedAt || record.expiresAt < new Date()) {
    throw new AppError("Refresh token invalid or expired", 401);
  }

  await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });
  const { accessToken } = await issueSession(res, record.user);

  res.json({ success: true, data: { token: accessToken } });
}

export async function logout(req: Request, res: Response) {
  const raw = req.cookies?.[REFRESH_COOKIE_NAME];
  if (raw) {
    await prisma.refreshToken.updateMany({ where: { tokenHash: hashToken(raw), revokedAt: null }, data: { revokedAt: new Date() } });
  }
  res.clearCookie(ACCESS_COOKIE_NAME, ACCESS_COOKIE_OPTIONS);
  res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
  res.json({ success: true, data: null, message: "Logged out" });
}

const forgotPasswordSchema = z.object({ email: z.string().email() });

export async function forgotPassword(req: Request, res: Response) {
  const { email } = forgotPasswordSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const passwordResetToken = generateRandomToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken, passwordResetExpires: new Date(Date.now() + 1000 * 60 * 60) },
    });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${passwordResetToken}`;
    await sendMail(email, "Reset your Kaylan Preschool password", passwordResetEmailTemplate(user.name, resetUrl));
  }

  res.json({ success: true, data: null, message: "If an account exists for that email, a reset link has been sent." });
}

const resetPasswordSchema = z.object({ token: z.string(), password: z.string().min(6) });

export async function resetPassword(req: Request, res: Response) {
  const { token, password } = resetPasswordSchema.parse(req.body);

  const user = await prisma.user.findFirst({
    where: { passwordResetToken: token, passwordResetExpires: { gt: new Date() } },
  });
  if (!user) throw new AppError("Reset token is invalid or has expired", 400);

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, passwordResetToken: null, passwordResetExpires: null },
  });
  // Revoke all outstanding refresh tokens on password reset.
  await prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });

  res.json({ success: true, data: null, message: "Password reset successfully" });
}

export async function verifyEmail(req: Request, res: Response) {
  const token = String(req.query.token ?? "");
  const user = await prisma.user.findFirst({ where: { emailVerificationToken: token } });
  if (!user) throw new AppError("Verification token is invalid", 400);

  await prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true, emailVerificationToken: null } });
  res.json({ success: true, data: { verified: true } });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user?.sub }, select: publicUser });
  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, data: { ...user, role: user.role.toLowerCase() } });
}
