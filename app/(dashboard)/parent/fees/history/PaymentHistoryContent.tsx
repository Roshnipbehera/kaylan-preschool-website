"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { listStudents } from "@/lib/api/students";
import { listPayments } from "@/lib/api/fees";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export function PaymentHistoryContent() {
  const { user } = useAuth();
  const { data: students } = useQuery({
    queryKey: queryKeys.students(user?.id),
    queryFn: () => listStudents({ parentUserId: user?.id }),
    enabled: !!user?.id,
  });
  const studentIds = students?.map((s) => s.id) ?? [];

  const { data: payments, isLoading } = useQuery({
    queryKey: queryKeys.payments(user?.id),
    queryFn: () => listPayments(),
    enabled: !!students,
  });

  const familyPayments = (payments ?? []).filter((p) => studentIds.includes(p.studentId));
  const studentName = (id: string) => students?.find((s) => s.id === id)?.fullName ?? "";

  return (
    <div>
      <ParentSubNav />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#3a2e4d]">Payment History</h1>
        <Link href="/parent/fees">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-1" /> Back to Fees
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : familyPayments.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No payment history yet.</p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 text-xs uppercase text-[#3a2e4d]/50">
                  <th className="py-2 pr-4">Child</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Method</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {familyPayments.map((p) => (
                  <tr key={p.id} className="border-b border-black/5">
                    <td className="py-2 pr-4">{studentName(p.studentId)}</td>
                    <td className="py-2 pr-4">{new Date(p.paidAt).toLocaleDateString()}</td>
                    <td className="py-2 pr-4">Rs. {p.amount.toLocaleString("en-IN")}</td>
                    <td className="py-2 pr-4 capitalize">{p.method.replace("-", " ")}</td>
                    <td className="py-2 pr-4">
                      <Badge tone={p.status === "success" ? "leaf" : "candy"}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
