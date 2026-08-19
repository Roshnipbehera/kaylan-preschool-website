import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { VerifyEmailStatus } from "./VerifyEmailStatus";

export const metadata: Metadata = {
  title: "Verify Email | Kaylan Preschool",
  description: "Confirm your email address for your Kaylan Preschool account.",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="Verify your email">
      <Suspense fallback={null}>
        <VerifyEmailStatus />
      </Suspense>
    </AuthLayout>
  );
}
