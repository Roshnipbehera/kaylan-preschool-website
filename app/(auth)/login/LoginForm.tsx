"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Sparkles } from "lucide-react";
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

const DEMO_CREDENTIALS: Record<Role, { email: string; pass: string }> = {
  parent: { email: "parent@kaylan.school", pass: "password123" },
  teacher: { email: "teacher@kaylan.school", pass: "password123" },
  admin: { email: "admin@kaylan.school", pass: "password123" },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const fillCredentialsForRole = (targetRole: Role) => {
    const creds = DEMO_CREDENTIALS[targetRole];
    setValue("role", targetRole);
    setValue("email", creds.email, { shouldValidate: true });
    setValue("password", creds.pass, { shouldValidate: true });
  };

  const handleRoleChange = (newRole: Role) => {
    setValue("role", newRole);
    const currentEmail = watch("email")?.trim().toLowerCase();
    const isDemoEmail = Object.values(DEMO_CREDENTIALS).some((c) => c.email.toLowerCase() === currentEmail);
    // If the input is empty or already using a demo email, seamlessly switch to the corresponding role's demo account
    if (!currentEmail || isDemoEmail) {
      fillCredentialsForRole(newRole);
    }
  };

  const onSubmit = async (values: LoginInput) => {
    setSubmitting(true);
    try {
      const cleanEmail = values.email.trim();
      const user = await login(cleanEmail, values.password, values.role);
      toast.success(`Welcome back, ${user.name}!`);
      const redirectTo = searchParams.get("redirectTo");
      const target = redirectTo || `/${user.role}`;
      router.push(target);
      router.refresh();
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
            onClick={() => handleRoleChange(r.value)}
            data-testid={`login-role-${r.value}`}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-heading font-semibold transition-colors ${
              role === r.value ? "bg-candy text-white" : "bg-lavender/10 text-[#3a2e4d]"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mb-5 rounded-2xl bg-gradient-to-r from-sky/15 via-lavender/15 to-candy/10 p-3.5 border border-sky/20 flex items-center justify-between gap-2 shadow-sm">
        <div className="text-xs">
          <p className="text-[#3a2e4d]/70 font-medium">Demo login for {role}:</p>
          <p className="font-heading font-bold text-candy mt-0.5 tracking-tight">
            {DEMO_CREDENTIALS[role].email}
          </p>
        </div>
        <button
          type="button"
          onClick={() => fillCredentialsForRole(role)}
          className="inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-candy hover:text-candy/90 px-3 py-1.5 rounded-xl text-xs font-heading font-bold shadow-sm border border-candy/20 hover:border-candy/40 transition-all shrink-0 active:scale-95"
        >
          <Sparkles size={13} className="text-sunshine fill-sunshine" />
          Auto-fill
        </button>
      </div>

      <div className="mb-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="your.email@kaylan.school"
          error={errors.email?.message}
          data-testid="login-email"
          {...register("email")}
        />
      </div>
      <div className="mb-2">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          data-testid="login-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-[#5b4b6b] hover:text-[#3a2e4d] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
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
