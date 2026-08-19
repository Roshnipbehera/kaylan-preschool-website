"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/schemas";
import { forgotPassword } from "@/lib/api/auth";
import { useToast } from "@/lib/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const toast = useToast();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setSubmitting(true);
    try {
      const res = await forgotPassword(values.email);
      toast.success(res.message);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div>
        <p className="mb-6 text-sm text-[#3a2e4d]/70">
          If an account exists for that email, we&apos;ve sent a reset link (check the browser console in this demo —
          Nodemailer sends real emails once the backend is connected).
        </p>
        <Link href="/login" className="font-heading text-candy hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      </div>
      <Button type="submit" className="w-full" isLoading={submitting}>
        Send reset link
      </Button>
      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="font-heading text-candy hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
