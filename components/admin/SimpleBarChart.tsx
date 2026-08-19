// Lightweight dependency-free bar chart, built from real computed values.
// Avoids adding a new npm dependency (e.g. recharts) for a scope this small.
export function SimpleBarChart({
  data,
  colorClass = "bg-candy",
}: {
  data: { label: string; value: number }[];
  colorClass?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-xs font-heading font-semibold text-[#3a2e4d]/80">
            <span>{d.label}</span>
            <span>{d.value}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-lavender/10">
            <div
              className={`h-full rounded-full ${colorClass}`}
              style={{ width: `${Math.max(4, Math.round((d.value / max) * 100))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
