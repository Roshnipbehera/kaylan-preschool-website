import { cn } from "@/lib/utils";

type Tone = "sunshine" | "sky" | "candy" | "leaf" | "orange" | "lavender";

const toneClasses: Record<Tone, string> = {
  sunshine: "bg-sunshine/20 text-yellow-700",
  sky: "bg-sky/20 text-sky-700",
  candy: "bg-candy/20 text-teal-800",
  leaf: "bg-leaf/20 text-green-700",
  orange: "bg-orange/20 text-orange-700",
  lavender: "bg-lavender/20 text-purple-700",
};

export function Badge({ tone = "candy", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-heading font-semibold", toneClasses[tone], className)}>
      {children}
    </span>
  );
}
