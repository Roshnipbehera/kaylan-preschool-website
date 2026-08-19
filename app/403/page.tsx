import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied | Kaylan Preschool",
  description: "You do not have permission to view this page.",
};

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf9ff] px-4 text-center">
      <h1 className="font-heading text-4xl font-bold text-[#3a2e4d]">403 — Access denied</h1>
      <p className="max-w-md text-[#3a2e4d]/70">You don&apos;t have permission to view this page with your current role.</p>
      <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-candy px-5 py-2.5 font-heading font-semibold text-white hover:bg-candy/90">
        Back to home
      </Link>
    </main>
  );
}
