"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, FileDown } from "lucide-react";
import { listInvoices, listPayments, createInvoice, recordPayment } from "@/lib/api/fees";
import { listStudents } from "@/lib/api/students";
import { exportToCsv } from "@/lib/utils/csvExport";
import { createInvoiceSchema, recordPaymentSchema, type CreateInvoiceFormValues, type RecordPaymentFormValues } from "@/lib/validation/fees";
import { queryKeys } from "@/lib/query/keys";
import { useModal } from "@/lib/hooks/useModal";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import type { Invoice, InvoiceStatus } from "@/lib/types/fees";
import type { Student } from "@/lib/types/students";

const STATUS_TONE: Record<InvoiceStatus, "leaf" | "sunshine" | "candy"> = {
  paid: "leaf",
  pending: "sunshine",
  overdue: "candy",
};

function InvoiceForm({ students, onDone }: { students: Student[]; onDone: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: { studentId: "", title: "", amount: 0, dueDate: "", status: "pending", lineItems: [] },
  });

  const onSubmit = async (values: CreateInvoiceFormValues) => {
    try {
      await createInvoice(values);
      qc.invalidateQueries({ queryKey: queryKeys.allInvoices });
      qc.invalidateQueries({ queryKey: queryKeys.adminStats });
      toast.success("Invoice created.");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create invoice");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Student</label>
        <select {...register("studentId")} className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5">
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName} ({s.className})
            </option>
          ))}
        </select>
        {errors.studentId && <p className="mt-1 text-xs font-semibold text-red-500">{errors.studentId.message}</p>}
      </FormField>
      <FormField>
        <Input label="Title" placeholder="e.g. Term 2 Tuition" {...register("title")} error={errors.title?.message} />
      </FormField>
      <FormField>
        <Input label="Amount" type="number" step="0.01" {...register("amount")} error={errors.amount?.message} />
      </FormField>
      <FormField>
        <Input label="Due date" type="date" {...register("dueDate")} error={errors.dueDate?.message} />
      </FormField>
      <FormField>
        <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Status</label>
        <select {...register("status")} className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5">
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          Create Invoice
        </Button>
      </div>
    </form>
  );
}

function PaymentForm({ invoice, onDone }: { invoice: Invoice; onDone: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecordPaymentFormValues>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: { invoiceId: invoice.id, studentId: invoice.studentId, amount: invoice.amount, method: "card" },
  });

  const onSubmit = async (values: RecordPaymentFormValues) => {
    try {
      await recordPayment(values);
      qc.invalidateQueries({ queryKey: queryKeys.allInvoices });
      qc.invalidateQueries({ queryKey: queryKeys.adminStats });
      toast.success(`Payment of ₹${values.amount} recorded. Invoice marked paid.`);
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record payment");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <Input label="Amount" type="number" step="0.01" {...register("amount")} error={errors.amount?.message} />
      </FormField>
      <FormField>
        <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">Method</label>
        <select {...register("method")} className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5">
          <option value="card">Card</option>
          <option value="bank-transfer">Bank Transfer</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
        </select>
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          Mark Paid
        </Button>
      </div>
    </form>
  );
}

export function AdminFeesContent() {
  const [filter, setFilter] = useState<InvoiceStatus | "all">("all");
  const { openModal, closeModal } = useModal();
  const { data: invoices, isLoading } = useQuery({ queryKey: queryKeys.allInvoices, queryFn: () => listInvoices() });
  const { data: payments } = useQuery({ queryKey: queryKeys.payments(), queryFn: () => listPayments() });
  const { data: students } = useQuery({ queryKey: queryKeys.allStudents, queryFn: () => listStudents() });

  const studentsById = new Map((students ?? []).map((s) => [s.id, s]));
  const filtered = (invoices ?? []).filter((i) => filter === "all" || i.status === filter);

  const totalCollected = (payments ?? []).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Fees</h1>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as InvoiceStatus | "all")}
            className="rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button
            variant="outline"
            onClick={() => {
              const exportData = filtered.map((inv) => ({
                invoiceId: inv.id,
                title: inv.title,
                studentName: studentsById.get(inv.studentId)?.fullName ?? inv.studentId,
                amount: inv.amount,
                status: inv.status,
                dueDate: inv.dueDate,
                issuedDate: inv.issuedDate,
              }));
              exportToCsv("kaylan_fees_report", exportData, [
                { key: "invoiceId", header: "Invoice ID" },
                { key: "title", header: "Invoice Title" },
                { key: "studentName", header: "Student Name" },
                { key: "amount", header: "Amount (Rs)" },
                { key: "status", header: "Status" },
                { key: "dueDate", header: "Due Date" },
                { key: "issuedDate", header: "Issued Date" },
              ]);
            }}
          >
            <FileDown size={16} className="mr-1" /> Export CSV
          </Button>
          <Button onClick={() => openModal({ title: "New Invoice", content: <InvoiceForm students={students ?? []} onDone={closeModal} /> })}>
            <Plus size={16} className="mr-1" /> New Invoice
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <p className="text-sm text-[#3a2e4d]/60">Total collected to date</p>
        <p className="text-3xl font-bold text-[#3a2e4d]">₹{totalCollected.toLocaleString()}</p>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No invoices found.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => (
            <Card key={inv.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading font-semibold">{inv.title}</p>
                <p className="text-xs text-[#3a2e4d]/60">
                  {studentsById.get(inv.studentId)?.fullName ?? inv.studentId} · ₹{inv.amount.toLocaleString()} · Due {inv.dueDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={STATUS_TONE[inv.status]}>{inv.status}</Badge>
                {inv.status !== "paid" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal({ title: `Record Payment: ${inv.title}`, content: <PaymentForm invoice={inv} onDone={closeModal} /> })}
                  >
                    Mark Paid
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
