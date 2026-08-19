"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/schemas";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Role } from "@/lib/types";

const ROLES: { value: Role; label: string }[] = [
  { value: "parent", label: "Parent" },
  { value: "teacher", label: "Teacher" },
  { value: "admin", label: "Admin" },
];

const DEMO_CREDENTIALS: Record<Role, string> = {
  parent: "parent@kaylan.school / password123",
  teacher: "teacher@kaylan.school / password123",
  admin: "admin@kaylan.school / password123",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "parent", email: "", password: "" },
  });

  const role = watch("role");

  const onSubmit = async (values: LoginInput) => {
    setSubmitting(true);
    try {
      const user = await login(values.email, values.password, values.role);
      toast.success(`Welcome back, ${user.name}!`);
      const redirectTo = searchParams.get("redirectTo");
      router.push(redirectTo || `/${user.role}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="login-form">
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Login as">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            role="tab"
            aria-selected={role === r.value}
            onClick={() => setValue("role", r.value)}
            data-testid={`login-role-${r.value}`}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-heading font-semibold transition-colors ${
              role === r.value ? "bg-candy text-white" : "bg-lavender/10 text-[#3a2e4d]"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mb-4 rounded-xl bg-sky/10 px-3 py-2 text-xs text-[#3a2e4d]/70">
        Demo credentials: <strong>{DEMO_CREDENTIALS[role]}</strong>
      </div>

      <div className="mb-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          data-testid="login-email"
          {...register("email")}
        />
      </div>
      <div className="mb-2">
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          data-testid="login-password"
          {...register("password")}
        />
      </div>
      <div className="mb-6 flex justify-end">
        <Link href="/forgot-password" className="text-sm font-heading text-candy hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" isLoading={submitting} data-testid="login-submit">
        Sign in
      </Button>
    </form>
  );
}
