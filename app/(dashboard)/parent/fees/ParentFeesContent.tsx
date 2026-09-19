"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileDown, History, IndianRupee } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { listStudents } from "@/lib/api/students";
import { listInvoices, listPayments, createRazorpayOrder, verifyRazorpayPayment } from "@/lib/api/fees";
import { loadRazorpayScript } from "@/lib/utils/razorpay";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Invoice, InvoiceStatus } from "@/lib/types/fees";

const STATUS_TONE: Record<InvoiceStatus, "leaf" | "sunshine" | "candy"> = {
  paid: "leaf",
  pending: "sunshine",
  overdue: "candy",
};

export function ParentFeesContent() {
  const { user } = useAuth();
  const toast = useToast();
  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id),
    queryFn: () => listStudents({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });
  const studentIds = students?.map((s) => s.id) ?? [];

  const { data: invoices, isLoading } = useQuery({
    queryKey: queryKeys.invoices(user?.id),
    queryFn: () => listInvoices(),
    enabled: !!students,
  });

  const { data: payments } = useQuery({
    queryKey: queryKeys.payments(user?.id),
    queryFn: () => listPayments(),
    enabled: !!students,
  });

  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const qc = useQueryClient();

  const familyInvoices = (invoices ?? []).filter((i) => studentIds.includes(i.studentId));
  const studentName = (id: string) => students?.find((s) => s.id === id)?.fullName ?? "";

  const paymentFor = (invoice: Invoice) => payments?.find((p) => p.invoiceId === invoice.id);

  const handlePayNow = async (invoice: Invoice) => {
    setPayingInvoiceId(invoice.id);
    try {
      const order = await createRazorpayOrder(invoice.id);
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded && !order.orderId.startsWith("order_mock_")) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
      }

      const RazorpayConstructor = (window as unknown as { Razorpay: unknown })?.Razorpay;

      if (RazorpayConstructor && !order.orderId.startsWith("order_mock_")) {
        const rzp = new (RazorpayConstructor as new (options: unknown) => { open: () => void })({
          key: order.keyId,
          amount: order.amount * 100,
          currency: order.currency || "INR",
          name: "Kaylan Preschool",
          description: invoice.title,
          order_id: order.orderId,
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: "#0F6B66",
          },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            try {
              await verifyRazorpayPayment({
                invoiceId: invoice.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              await qc.invalidateQueries({ queryKey: queryKeys.invoices(user?.id) });
              await qc.invalidateQueries({ queryKey: queryKeys.payments(user?.id) });
              toast.success("Payment successful! Fee receipt is ready for download.");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Payment verification failed.");
            }
          },
        });
        rzp.open();
      } else {
        // Fallback test/sandbox mode when keys are not configured
        const mockPaymentId = `pay_mock_${Date.now()}`;
        await verifyRazorpayPayment({
          invoiceId: invoice.id,
          razorpay_order_id: order.orderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: "mock_signature_valid",
        });
        await qc.invalidateQueries({ queryKey: queryKeys.invoices(user?.id) });
        await qc.invalidateQueries({ queryKey: queryKeys.payments(user?.id) });
        toast.success("Payment completed in sandbox mode! Fee receipt is ready for download.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment processing failed. Please try again.");
    } finally {
      setPayingInvoiceId(null);
    }
  };

  return (
    <div>
      <ParentSubNav />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Fee Status</h1>
        <Link href="/parent/fees/history">
          <Button variant="outline">
            <History size={16} className="mr-1" /> Payment History
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      ) : familyInvoices.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No invoices found for your account.</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {familyInvoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee size={18} className="text-candy" /> {invoice.title}
                </CardTitle>
                <Badge tone={STATUS_TONE[invoice.status]}>{invoice.status}</Badge>
              </CardHeader>
              <p className="mb-1 text-sm text-[#3a2e4d]/60">For {studentName(invoice.studentId)}</p>
              <p className="mb-3 text-2xl font-bold text-[#3a2e4d]">Rs. {invoice.amount.toLocaleString("en-IN")}</p>
              <dl className="mb-4 space-y-1 text-sm text-[#3a2e4d]/70">
                <div>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                <div>Issued: {new Date(invoice.issuedDate).toLocaleDateString()}</div>
              </dl>
              <ul className="mb-4 space-y-1 rounded-xl bg-[#faf9ff] p-3 text-sm">
                {invoice.lineItems.map((item) => (
                  <li key={item.label} className="flex justify-between">
                    <span>{item.label}</span>
                    <span>Rs. {item.amount.toLocaleString("en-IN")}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {invoice.status === "paid" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      // jsPDF is a fairly heavy dependency -- only load it when the
                      // user actually asks to download a receipt, not on page load.
                      import("@/lib/pdf/feeReceipt").then(({ downloadFeeReceipt }) =>
                        downloadFeeReceipt(invoice, paymentFor(invoice)),
                      )
                    }
                  >
                    <FileDown size={16} className="mr-1" /> Download Receipt
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={payingInvoiceId === invoice.id}
                    onClick={() => handlePayNow(invoice)}
                  >
                    Pay Now
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
