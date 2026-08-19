"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf9ff] px-4 text-center">
      <h1 className="font-heading text-3xl font-bold text-[#3a2e4d]">Oops, something went wrong</h1>
      <p className="max-w-md text-[#3a2e4d]/70">
        Our storybook world hit a snag. Please try again, or head back home.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-candy px-5 py-2.5 font-heading font-semibold text-candy hover:bg-candy/10">
          Go home
        </Link>
      </div>
    </main>
  );
}
