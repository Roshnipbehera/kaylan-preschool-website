"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettings, saveSettings } from "@/lib/api/settings";
import { systemSettingsSchema, type SystemSettingsFormValues } from "@/lib/validation/settings";
import { queryKeys } from "@/lib/query/keys";
import { useToast } from "@/lib/hooks/useToast";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

export function AdminSettingsContent() {
  const toast = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.systemSettings, queryFn: getSettings });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      schoolName: "",
      contactEmail: "",
      contactPhone: "",
      currency: "INR",
      academicYearStart: "",
      academicYearEnd: "",
      termDates: "",
      maintenanceMode: false,
      logoUrl: "",
      address: "",
      schoolTimings: "",
      admissionsOpen: true,
      facebookUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      googleMapsUrl: "",
    },
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const saveMutation = useMutation({
    mutationFn: (payload: SystemSettingsFormValues) => saveSettings(payload),
    onSuccess: (saved) => {
      qc.setQueryData(queryKeys.systemSettings, saved);
      qc.invalidateQueries({ queryKey: queryKeys.systemSettings });
      toast.success("Settings saved.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to save settings"),
  });

  const onSubmit = (values: SystemSettingsFormValues) => saveMutation.mutate(values);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">System Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <div className="grid gap-x-4 sm:grid-cols-2">
            <FormField>
              <Input label="School name" {...register("schoolName")} error={errors.schoolName?.message} />
            </FormField>
            <FormField>
              <Input label="Contact email" type="email" {...register("contactEmail")} error={errors.contactEmail?.message} />
            </FormField>
            <FormField>
              <Input label="Contact phone" {...register("contactPhone")} error={errors.contactPhone?.message} />
            </FormField>
            <FormField>
              <Input label="Currency" {...register("currency")} error={errors.currency?.message} />
            </FormField>
            <FormField>
              <Input label="Academic year start" type="date" {...register("academicYearStart")} error={errors.academicYearStart?.message} />
            </FormField>
            <FormField>
              <Input label="Academic year end" type="date" {...register("academicYearEnd")} error={errors.academicYearEnd?.message} />
            </FormField>
          </div>
          <FormField>
            <Input label="Term dates" {...register("termDates")} error={errors.termDates?.message} />
          </FormField>
          <FormField>
            <label className="flex items-center gap-2 text-sm text-[#3a2e4d]/80">
              <input type="checkbox" {...register("maintenanceMode")} />
              Maintenance mode (shows a maintenance notice to non-admin users)
            </label>
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="submit" isLoading={isSubmitting || saveMutation.isPending}>
              Save Settings
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Branding &amp; Public Details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <div className="grid gap-x-4 sm:grid-cols-2">
            <FormField>
              <Input label="Logo URL" placeholder="https://..." {...register("logoUrl")} error={errors.logoUrl?.message} />
            </FormField>
            <FormField>
              <Input label="School timings" placeholder="Mon-Fri, 9:00 AM - 3:00 PM" {...register("schoolTimings")} error={errors.schoolTimings?.message} />
            </FormField>
            <FormField>
              <Input label="Google Maps link" placeholder="https://maps.google.com/?q=..." {...register("googleMapsUrl")} error={errors.googleMapsUrl?.message} />
            </FormField>
            <FormField>
              <Input label="Facebook URL" {...register("facebookUrl")} error={errors.facebookUrl?.message} />
            </FormField>
            <FormField>
              <Input label="Instagram URL" {...register("instagramUrl")} error={errors.instagramUrl?.message} />
            </FormField>
            <FormField>
              <Input label="Twitter / X URL" {...register("twitterUrl")} error={errors.twitterUrl?.message} />
            </FormField>
          </div>
          <FormField>
            <Input label="School address" {...register("address")} error={errors.address?.message} />
          </FormField>
          <FormField>
            <label className="flex items-center gap-2 text-sm text-[#3a2e4d]/80">
              <input type="checkbox" {...register("admissionsOpen")} />
              Admissions are currently open (shown on the public Admissions page)
            </label>
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="submit" isLoading={isSubmitting || saveMutation.isPending}>
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
