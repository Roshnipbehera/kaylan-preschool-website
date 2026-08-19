"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyEmail } from "@/lib/api/auth";
import { Spinner } from "@/components/ui/Spinner";

export function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "verified" | "invalid">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    verifyEmail(token)
      .then((res) => setStatus(res.verified ? "verified" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-[#3a2e4d]/70">Verifying your email…</p>
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-leaf" aria-hidden="true" />
        <p className="font-heading font-semibold text-[#3a2e4d]">Your email has been verified!</p>
        <Link href="/login" className="font-heading text-candy hover:underline">
          Continue to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <XCircle className="h-12 w-12 text-red-400" aria-hidden="true" />
      <p className="font-heading font-semibold text-[#3a2e4d]">This verification link is invalid or has expired.</p>
      <Link href="/login" className="font-heading text-candy hover:underline">
        Back to login
      </Link>
    </div>
  );
}
