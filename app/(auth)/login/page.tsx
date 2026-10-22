import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Portal Login | Kaylan Preschool",
  description: "Sign in to the Kaylan Preschool parent, teacher, or admin portal.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Portal Login | Kaylan Preschool",
    description: "Sign in to the Kaylan Preschool parent, teacher, or admin portal.",
    url: "/login",
  },
};

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back!" subtitle="Sign in to your Kaylan Preschool account">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
