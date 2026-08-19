import type { Metadata } from "next";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Kaylan Preschool",
  description: "Reset the password for your Kaylan Preschool account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot your password?" subtitle="We'll send a reset link to your email">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
