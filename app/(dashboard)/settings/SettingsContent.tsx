"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/schemas";
import { changePassword, updateSettings, getSettings } from "@/lib/api/user";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import type { NotificationPreferences } from "@/lib/types";

const DEFAULT_PREFS: NotificationPreferences = { emailUpdates: true, smsAlerts: false, weeklyDigest: true };

export function SettingsContent() {
  const toast = useToast();
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: savedPrefs } = useQuery({
    queryKey: ["preferences", user?.id],
    queryFn: () => getSettings(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (savedPrefs) setPrefs(savedPrefs);
  }, [savedPrefs]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  const togglePref = async (key: keyof NotificationPreferences) => {
    if (!user?.id) return;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    setSavingPrefs(true);
    try {
      await updateSettings(user.id, next);
    } catch {
      toast.error("Could not save preference.");
      setPrefs(prefs);
    } finally {
      setSavingPrefs(false);
    }
  };

  const onSubmit = async (values: ChangePasswordInput) => {
    setSubmitting(true);
    try {
      const res = await changePassword(values);
      toast.success(res.message);
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="sm:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile Details</CardTitle>
          <Link href="/profile">
            <Button variant="outline" size="sm">
              Edit profile
            </Button>
          </Link>
        </CardHeader>
        <p className="text-sm text-[#3a2e4d]/60">
          Update your name, email, phone number and avatar from the Profile page.
        </p>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences {savingPrefs && <span className="text-xs font-normal text-[#3a2e4d]/50">(saving…)</span>}</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {(Object.keys(prefs) as (keyof NotificationPreferences)[]).map((key) => (
            <label key={key} className="flex items-center justify-between rounded-xl bg-[#faf9ff] px-3 py-2">
              <span className="text-sm font-heading capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => togglePref(key)}
                className="h-5 w-5 accent-candy"
                aria-label={key}
              />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <Input label="Current password" type="password" error={errors.currentPassword?.message} {...register("currentPassword")} />
          </div>
          <div className="mb-3">
            <Input label="New password" type="password" error={errors.newPassword?.message} {...register("newPassword")} />
          </div>
          <div className="mb-4">
            <Input label="Confirm new password" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          </div>
          <Button type="submit" isLoading={submitting}>
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}
