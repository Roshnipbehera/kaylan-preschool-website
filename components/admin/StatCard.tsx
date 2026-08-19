import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function StatCard({ title, value, sub }: { title: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <p className="text-3xl font-bold text-[#3a2e4d]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[#3a2e4d]/60">{sub}</p>}
    </Card>
  );
}
