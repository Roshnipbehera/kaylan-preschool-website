"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {
  createAdmissionSchema,
  type CreateAdmissionFormValues,
} from "@/lib/validation/admissions";
import { createApplication } from "@/lib/api/admissions";
import { uploadAdmissionDocument } from "@/lib/api/upload";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";

const STEPS = ["Child", "Guardian", "Medical", "Documents", "Review"] as const;

const STEP_FIELDS: (keyof CreateAdmissionFormValues | `${string}.${string}`)[][] = [
  ["child.fullName", "child.dateOfBirth", "child.gender", "child.programApplyingFor", "child.nationality"],
  ["guardian.fullName", "guardian.relation", "guardian.phone", "guardian.email", "guardian.occupation", "guardian.address"],
  [
    "medical.bloodGroup",
    "medical.emergencyContactName",
    "medical.emergencyContactPhone",
  ],
  ["documents.birthCertificateUrl", "documents.childPhotoUrl"],
];

const DEFAULT_VALUES: CreateAdmissionFormValues = {
  child: { fullName: "", dateOfBirth: "", gender: "male", programApplyingFor: "", nationality: "" },
  guardian: { fullName: "", relation: "", phone: "", email: "", occupation: "", address: "" },
  medical: {
    allergies: "",
    conditions: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    doctorName: "",
    doctorPhone: "",
  },
  documents: { birthCertificateUrl: "", childPhotoUrl: "" },
};

export function AdmissionApplyForm() {
  const { user } = useAuth();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAdmissionFormValues>({
    resolver: zodResolver(createAdmissionSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const values = watch();

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = fields ? await trigger(fields as any) : true;
    if (!valid) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "documents.birthCertificateUrl" | "documents.childPhotoUrl",
    kind: "birth-certificate" | "child-photo",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingKey(field);
    try {
      const { url } = await uploadAdmissionDocument(file, kind);
      setValue(field, url, { shouldValidate: true });
      toast.success(`${kind === "birth-certificate" ? "Birth certificate" : "Photo"} uploaded.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  const onSubmit = async (data: CreateAdmissionFormValues) => {
    setSubmitting(true);
    try {
      const app = await createApplication({ ...data, parentUserId: user?.id });
      setSubmittedId(app.id);
      // eslint-disable-next-line no-console
      console.log(`[MOCK EMAIL] Application received confirmation sent to ${data.guardian.email} (application #${app.id})`);
      toast.success("Application submitted! A confirmation email has been sent.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <Card className="text-center py-12">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-leaf" />
        <h2 className="font-display text-2xl font-bold mb-2">Application Submitted! 🎉</h2>
        <p className="text-[#5b4b6b] mb-1">
          Reference ID: <span className="font-mono font-semibold">{submittedId}</span>
        </p>
        <p className="text-[#5b4b6b] mb-6">
          {user
            ? "You can track your application status from your parent dashboard."
            : "Log in as a parent to track your application status and download a receipt."}
        </p>
        {user ? (
          <Button onClick={() => (window.location.href = "/parent/admissions")}>View My Applications</Button>
        ) : (
          <Button onClick={() => (window.location.href = "/login")}>Log In to Track Application</Button>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                i <= step ? "bg-candy text-white" : "bg-lavender/20 text-[#3a2e4d]/50"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-xs mt-1 text-[#3a2e4d]/70 hidden sm:block">{label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} data-testid="admission-apply-form">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div className="space-y-1">
                <FormField>
                  <Input label="Child's Full Name" data-testid="admission-child-fullname" {...register("child.fullName")} error={errors.child?.fullName?.message} />
                </FormField>
                <FormField>
                  <Input type="date" label="Date of Birth" {...register("child.dateOfBirth")} error={errors.child?.dateOfBirth?.message} />
                </FormField>
                <FormField>
                  <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Gender</label>
                  <select {...register("child.gender")} className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </FormField>
                <FormField>
                  <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Program Applying For</label>
                  <select {...register("child.programApplyingFor")} className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 text-xs text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy">
                    <option value="">Select Program</option>
                    <option value="Playgroup L0 (2-3y)">Playgroup L0 (2 – 3 Years)</option>
                    <option value="Nursery L1 (3-4y)">Nursery L1 (3 – 4 Years)</option>
                    <option value="Junior KG L3 (4-5y)">Junior KG L3 (4 – 5 Years)</option>
                    <option value="Senior KG L4 (5-6y)">Senior KG L4 (5 – 6 Years)</option>
                    <option value="Daycare (1-10y)">Extended Daycare (Ages 1 – 10 Years)</option>
                    <option value="After-School Program (4-10y)">After-School Program (Ages 4 – 10 Years)</option>
                  </select>
                  {errors.child?.programApplyingFor?.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.child.programApplyingFor.message}</p>
                  )}
                </FormField>
                <FormField>
                  <Input label="Nationality" {...register("child.nationality")} error={errors.child?.nationality?.message} />
                </FormField>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-1">
                <FormField>
                  <Input label="Guardian's Full Name" {...register("guardian.fullName")} error={errors.guardian?.fullName?.message} />
                </FormField>
                <FormField>
                  <Input label="Relation to Child" placeholder="Mother / Father / Guardian" {...register("guardian.relation")} error={errors.guardian?.relation?.message} />
                </FormField>
                <FormField>
                  <Input label="Phone" {...register("guardian.phone")} error={errors.guardian?.phone?.message} />
                </FormField>
                <FormField>
                  <Input type="email" label="Email" {...register("guardian.email")} error={errors.guardian?.email?.message} />
                </FormField>
                <FormField>
                  <Input label="Occupation" {...register("guardian.occupation")} error={errors.guardian?.occupation?.message} />
                </FormField>
                <FormField>
                  <Input label="Address" {...register("guardian.address")} error={errors.guardian?.address?.message} />
                </FormField>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-1">
                <FormField>
                  <Input label="Allergies (if any)" {...register("medical.allergies")} />
                </FormField>
                <FormField>
                  <Input label="Medical Conditions (if any)" {...register("medical.conditions")} />
                </FormField>
                <FormField>
                  <Input label="Blood Group" placeholder="e.g. O+" {...register("medical.bloodGroup")} error={errors.medical?.bloodGroup?.message} />
                </FormField>
                <FormField>
                  <Input label="Emergency Contact Name" {...register("medical.emergencyContactName")} error={errors.medical?.emergencyContactName?.message} />
                </FormField>
                <FormField>
                  <Input label="Emergency Contact Phone" {...register("medical.emergencyContactPhone")} error={errors.medical?.emergencyContactPhone?.message} />
                </FormField>
                <FormField>
                  <Input label="Family Doctor Name" {...register("medical.doctorName")} />
                </FormField>
                <FormField>
                  <Input label="Family Doctor Phone" {...register("medical.doctorPhone")} />
                </FormField>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <FormField>
                  <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">
                    Birth Certificate (image or PDF)
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileUpload(e, "documents.birthCertificateUrl", "birth-certificate")}
                    className="block w-full text-sm"
                  />
                  {uploadingKey === "documents.birthCertificateUrl" && <p className="text-xs text-[#5b4b6b] mt-1">Uploading...</p>}
                  {values.documents?.birthCertificateUrl && (
                    <p className="text-xs text-leaf mt-1 break-all">Uploaded: {values.documents.birthCertificateUrl}</p>
                  )}
                  {errors.documents?.birthCertificateUrl && (
                    <p className="text-xs font-semibold text-red-500 mt-1">{errors.documents.birthCertificateUrl.message}</p>
                  )}
                </FormField>
                <FormField>
                  <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Child Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "documents.childPhotoUrl", "child-photo")}
                    className="block w-full text-sm"
                  />
                  {uploadingKey === "documents.childPhotoUrl" && <p className="text-xs text-[#5b4b6b] mt-1">Uploading...</p>}
                  {values.documents?.childPhotoUrl && (
                    <p className="text-xs text-leaf mt-1 break-all">Uploaded: {values.documents.childPhotoUrl}</p>
                  )}
                  {errors.documents?.childPhotoUrl && (
                    <p className="text-xs font-semibold text-red-500 mt-1">{errors.documents.childPhotoUrl.message}</p>
                  )}
                </FormField>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-sm">
                <ReviewBlock title="Child Details" rows={[
                  ["Name", values.child?.fullName],
                  ["Date of Birth", values.child?.dateOfBirth],
                  ["Gender", values.child?.gender],
                  ["Program", values.child?.programApplyingFor],
                  ["Nationality", values.child?.nationality],
                ]} />
                <ReviewBlock title="Guardian" rows={[
                  ["Name", values.guardian?.fullName],
                  ["Relation", values.guardian?.relation],
                  ["Phone", values.guardian?.phone],
                  ["Email", values.guardian?.email],
                  ["Occupation", values.guardian?.occupation],
                  ["Address", values.guardian?.address],
                ]} />
                <ReviewBlock title="Medical" rows={[
                  ["Blood Group", values.medical?.bloodGroup],
                  ["Allergies", values.medical?.allergies || "None"],
                  ["Conditions", values.medical?.conditions || "None"],
                  ["Emergency Contact", `${values.medical?.emergencyContactName} (${values.medical?.emergencyContactPhone})`],
                ]} />
                <ReviewBlock title="Documents" rows={[
                  ["Birth Certificate", values.documents?.birthCertificateUrl ? "Uploaded ✅" : "Missing"],
                  ["Child Photo", values.documents?.childPhotoUrl ? "Uploaded ✅" : "Missing"],
                ]} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button type="button" variant="ghost" onClick={goBack} disabled={step === 0} data-testid="admission-back">
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext} data-testid="admission-next">
              Next
            </Button>
          ) : (
            <Button type="submit" isLoading={submitting} data-testid="admission-submit">
              Submit Application
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

function ReviewBlock({ title, rows }: { title: string; rows: [string, string | undefined][] }) {
  return (
    <div className="rounded-2xl bg-[#faf9ff] p-4">
      <h3 className="font-heading font-bold mb-2">{title}</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between sm:block">
            <dt className="text-[#3a2e4d]/60">{k}</dt>
            <dd className="font-medium break-words">{v || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
