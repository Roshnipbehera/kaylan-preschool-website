"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validation/schemas";
import { updateProfile } from "@/lib/api/user";
import { uploadAvatar } from "@/lib/api/upload";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export function ProfileForm() {
  const { user } = useAuth();
  const toast = useToast();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", phone: "" },
  });

  const onSubmit = async (values: ProfileInput) => {
    setSubmitting(true);
    try {
      await updateProfile(values);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadAvatar(file);
      setAvatarUrl(url);
      toast.success("Avatar uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-xl">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-lavender/20 text-xl font-bold text-[#3a2e4d]">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Your avatar" width={64} height={64} className="h-full w-full object-cover" />
          ) : (
            (user?.name ?? "U").charAt(0)
          )}
        </div>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} aria-label="Upload avatar" />
          <Button type="button" variant="outline" size="sm" isLoading={uploading} onClick={() => fileInputRef.current?.click()}>
            {uploading ? "Uploading" : "Change avatar"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <Input label="Full name" error={errors.name?.message} {...register("name")} />
        </div>
        <div className="mb-4">
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        </div>
        <div className="mb-6">
          <Input label="Phone (optional)" type="tel" error={errors.phone?.message} {...register("phone")} />
        </div>
        <Button type="submit" isLoading={submitting}>
          {submitting && <Spinner className="hidden" />}
          Save changes
        </Button>
      </form>
    </Card>
  );
}
