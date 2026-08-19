"use client";

import { useQuery } from "@tanstack/react-query";
import { FileDown, FileText } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { listDownloadDocuments } from "@/lib/api/downloads";
import { listStudents } from "@/lib/api/students";
import { listInvoices, listPayments } from "@/lib/api/fees";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export function ParentDownloadsContent() {
  const { user } = useAuth();
  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: queryKeys.downloadDocuments,
    queryFn: listDownloadDocuments,
  });

  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id),
    queryFn: () => listStudents({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });
  const studentIds = students?.map((s) => s.id) ?? [];

  const { data: invoices } = useQuery({
    queryKey: queryKeys.invoices(user?.id),
    queryFn: () => listInvoices(),
    enabled: !!students,
  });
  const { data: payments } = useQuery({
    queryKey: queryKeys.payments(user?.id),
    queryFn: () => listPayments(),
    enabled: !!students,
  });

  const paidInvoices = (invoices ?? []).filter((i) => studentIds.includes(i.studentId) && i.status === "paid");

  return (
    <div>
      <ParentSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">Document Center</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fee Receipts</CardTitle>
        </CardHeader>
        {paidInvoices.length === 0 ? (
          <p className="text-sm text-[#3a2e4d]/60">No paid invoices yet.</p>
        ) : (
          <ul className="space-y-2">
            {paidInvoices.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between rounded-xl bg-[#faf9ff] px-3 py-2">
                <span className="text-sm">{invoice.title}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    import("@/lib/pdf/feeReceipt").then(({ downloadFeeReceipt }) =>
                      downloadFeeReceipt(invoice, payments?.find((p) => p.invoiceId === invoice.id)),
                    )
                  }
                >
                  <FileDown size={14} className="mr-1" /> Download
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>School Documents</CardTitle>
        </CardHeader>
        {docsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !documents || documents.length === 0 ? (
          <p className="text-sm text-[#3a2e4d]/60">No documents available.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between rounded-xl bg-[#faf9ff] px-3 py-2">
                <span className="flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-sky" /> {doc.title}
                  <Badge tone="sky" className="ml-1">{doc.category}</Badge>
                </span>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    <FileDown size={14} className="mr-1" /> Open
                  </Button>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
