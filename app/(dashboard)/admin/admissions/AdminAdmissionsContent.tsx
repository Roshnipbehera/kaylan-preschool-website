"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Download } from "lucide-react";
import { listApplications, updateApplicationStatus } from "@/lib/api/admissions";
import { queryKeys } from "@/lib/query/keys";
import { useModal } from "@/lib/hooks/useModal";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { exportToCsv } from "@/lib/utils/csvExport";
import type { AdmissionApplication, AdmissionStatus } from "@/lib/types/admissions";

const STATUS_TONE: Record<AdmissionStatus, "sunshine" | "sky" | "leaf" | "candy" | "orange"> = {
  submitted: "sky",
  "under-review": "sunshine",
  accepted: "leaf",
  rejected: "candy",
  waitlisted: "orange",
};

const STATUS_OPTIONS: AdmissionStatus[] = ["submitted", "under-review", "accepted", "rejected", "waitlisted"];

function ApplicationDetail({ app }: { app: AdmissionApplication }) {
  const qc = useQueryClient();
  const toast = useToast();
  const { closeModal } = useModal();
  const [status, setStatus] = useState<AdmissionStatus>(app.status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updateApplicationStatus(app.id, status);
      qc.invalidateQueries({ queryKey: queryKeys.admissions });
      // eslint-disable-next-line no-console
      console.log(`[MOCK EMAIL] Status update sent to ${app.guardian.email}: application #${app.id} is now "${updated.status}"`);
      toast.success(`Status updated to "${status}". Confirmation email sent.`);
      closeModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto text-sm space-y-4">
      <section>
        <h3 className="font-heading font-bold mb-1">Child</h3>
        <p>{app.child.fullName} — {app.child.dateOfBirth} — {app.child.gender}</p>
        <p>Program: {app.child.programApplyingFor} | Nationality: {app.child.nationality}</p>
      </section>
      <section>
        <h3 className="font-heading font-bold mb-1">Guardian</h3>
        <p>{app.guardian.fullName} ({app.guardian.relation})</p>
        <p>{app.guardian.phone} | {app.guardian.email}</p>
        <p>{app.guardian.occupation} — {app.guardian.address}</p>
      </section>
      <section>
        <h3 className="font-heading font-bold mb-1">Medical</h3>
        <p>Blood Group: {app.medical.bloodGroup}</p>
        <p>Allergies: {app.medical.allergies || "None"}</p>
        <p>Conditions: {app.medical.conditions || "None"}</p>
        <p>Emergency: {app.medical.emergencyContactName} ({app.medical.emergencyContactPhone})</p>
        <p>Doctor: {app.medical.doctorName || "-"} {app.medical.doctorPhone || ""}</p>
      </section>
      <section>
        <h3 className="font-heading font-bold mb-1">Documents</h3>
        <a className="text-sky underline break-all block" href={app.documents.birthCertificateUrl} target="_blank" rel="noreferrer">
          Birth Certificate
        </a>
        <a className="text-sky underline break-all block" href={app.documents.childPhotoUrl} target="_blank" rel="noreferrer">
          Child Photo
        </a>
      </section>
      <section className="flex items-end gap-3 pt-2 border-t">
        <div className="flex-1">
          <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AdmissionStatus)}
            className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={save} isLoading={saving}>
          Save
        </Button>
      </section>
    </div>
  );
}

export function AdminAdmissionsContent() {
  const [filter, setFilter] = useState<AdmissionStatus | "all">("all");
  const { openModal } = useModal();
  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.admissions, filter],
    queryFn: () => listApplications(filter === "all" ? undefined : { status: filter }),
  });

  const handleExportCsv = () => {
    if (!data || data.length === 0) return;
    const flatRows = data.map((app) => ({
      id: app.id,
      childName: app.child.fullName,
      dob: app.child.dateOfBirth,
      gender: app.child.gender,
      program: app.child.programApplyingFor,
      guardianName: app.guardian.fullName,
      relation: app.guardian.relation,
      phone: app.guardian.phone,
      email: app.guardian.email,
      status: app.status,
      bloodGroup: app.medical.bloodGroup,
      allergies: app.medical.allergies || "None",
      submittedAt: new Date(app.submittedAt).toLocaleDateString(),
    }));
    exportToCsv("kaylan_admissions_applications", flatRows, [
      { key: "id", header: "Application ID" },
      { key: "childName", header: "Child Name" },
      { key: "dob", header: "Date of Birth" },
      { key: "gender", header: "Gender" },
      { key: "program", header: "Program" },
      { key: "guardianName", header: "Guardian Name" },
      { key: "relation", header: "Relation" },
      { key: "phone", header: "Phone" },
      { key: "email", header: "Email" },
      { key: "status", header: "Status" },
      { key: "bloodGroup", header: "Blood Group" },
      { key: "allergies", header: "Allergies" },
      { key: "submittedAt", header: "Submitted Date" },
    ]);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Admission Applications</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={!data || data.length === 0}>
            <Download size={14} className="mr-1.5" /> Export CSV
          </Button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as AdmissionStatus | "all")}
            className="rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2 text-sm"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No applications found.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((app) => (
            <Card key={app.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading font-semibold">{app.child.fullName}</p>
                <p className="text-xs text-[#3a2e4d]/60">
                  {app.child.programApplyingFor} · Guardian: {app.guardian.fullName} · {new Date(app.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={STATUS_TONE[app.status]}>{app.status.replace("-", " ")}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal({ title: `Application: ${app.child.fullName}`, content: <ApplicationDetail app={app} /> })}
                >
                  <Eye size={16} className="mr-1" /> View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
