import { cn } from "@/lib/utils";

export function FormField({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}
