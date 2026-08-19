"use client";

import { useQuery } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";
import { listAnnouncements } from "@/lib/api/announcements";
import { queryKeys } from "@/lib/query/keys";
import { ParentSubNav } from "@/components/parent/ParentSubNav";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export function ParentAnnouncementsContent() {
  const { data, isLoading } = useQuery({ queryKey: queryKeys.announcements, queryFn: listAnnouncements });

  return (
    <div>
      <ParentSubNav />
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">Announcements</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No announcements right now.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((a) => (
            <Card key={a.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Megaphone size={18} className="text-orange" /> {a.title}
                </CardTitle>
                <Badge tone="lavender">{a.audience}</Badge>
              </CardHeader>
              <p className="mb-2 text-sm text-[#3a2e4d]/70">{a.body}</p>
              <p className="text-xs text-[#3a2e4d]/50">{new Date(a.date).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
