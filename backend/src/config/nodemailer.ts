import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "Kaylan Preschool <no-reply@kaylanpreschool.com>",
    to,
    subject,
    html,
  });
}

export function verificationEmailTemplate(name: string, verifyUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Welcome to Kaylan Preschool, ${name}!</h2>
      <p>Please confirm your email address to activate your account.</p>
      <p><a href="${verifyUrl}" style="background:#FF8FB1;color:#fff;padding:10px 20px;border-radius:999px;text-decoration:none;">Verify Email</a></p>
      <p>If the button doesn't work, copy this link: ${verifyUrl}</p>
    </div>
  `;
}

export function passwordResetEmailTemplate(name: string, resetUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Password reset request</h2>
      <p>Hi ${name}, we received a request to reset your password.</p>
      <p><a href="${resetUrl}" style="background:#6EC6FF;color:#fff;padding:10px 20px;border-radius:999px;text-decoration:none;">Reset Password</a></p>
      <p>If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>
    </div>
  `;
}
