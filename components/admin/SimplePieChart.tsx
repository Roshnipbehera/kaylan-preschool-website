// Lightweight dependency-free "pie" chart rendered as a conic-gradient SVG-free
// donut, driven entirely by real computed values (no static image).
const COLORS = ["#f472b6", "#38bdf8", "#facc15", "#4ade80", "#fb923c", "#a78bfa"];

export function SimplePieChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulative = 0;
  const stops = data.map((d, i) => {
    const start = (cumulative / total) * 360;
    cumulative += d.value;
    const end = (cumulative / total) * 360;
    return `${COLORS[i % COLORS.length]} ${start}deg ${end}deg`;
  });

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div
        className="h-32 w-32 shrink-0 rounded-full"
        style={{ background: total > 0 ? `conic-gradient(${stops.join(", ")})` : "#eee" }}
        aria-label="Distribution chart"
        role="img"
      />
      <ul className="space-y-1 text-sm">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="font-heading font-semibold text-[#3a2e4d]">{d.label}</span>
            <span className="text-[#3a2e4d]/60">({d.value})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
