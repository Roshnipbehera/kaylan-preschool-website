"use client";
// Fetches a CMS section via React Query, using the component's local seed
// data as `initialData` so there is zero layout shift / flash on first
// paint -- the seed IS the current design's content, and the CMS simply
// becomes the editable source of truth after the first admin save.
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCmsSection, updateCmsSection } from "@/lib/api/cms";
import { queryKeys } from "@/lib/query/keys";
import type { CmsSectionMap, CmsSectionKey } from "@/lib/types/cms";

export function useCmsSection<K extends CmsSectionKey>(section: K, seed: CmsSectionMap[K]) {
  const query = useQuery({
    queryKey: queryKeys.cms(section),
    queryFn: () => getCmsSection(section),
    initialData: () => seed,
    staleTime: 60_000,
  });
  // `initialData` as a function guarantees react-query never reports
  // `data` as undefined, but its overload resolution doesn't always narrow
  // that through generics -- assert the non-undefined type explicitly so
  // consuming components can use `data` without redundant optional checks.
  return query as typeof query & { data: CmsSectionMap[K] };
}

export function useCmsMutation<K extends CmsSectionKey>(section: K) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CmsSectionMap[K]) => updateCmsSection(section, data),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.cms(section), data);
    },
  });
}
