import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 role="status" aria-label="Loading" className={cn("h-5 w-5 animate-spin text-candy", className)} />;
}
