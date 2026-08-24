"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api";
import { useLocale } from "@/hooks/useLocale";
import type { LocaleCode } from "@/lib/constants";

export function usePublicList<T>(
  endpoint: string,
  params?: Record<string, string>,
  fallback: T[] = [],
  localize?: (item: T, locale: LocaleCode) => T
): UseQueryResult<T[], Error> {
  const { locale } = useLocale();

  return useQuery<T[], Error>({
    queryKey: ["public", endpoint, params, locale],
    queryFn: async (): Promise<T[]> => {
      try {
        const res = await api.get(endpoint, { params: { limit: "12", locale, ...params } });
        const data = res.data.data;
        const items = Array.isArray(data) ? data : data?.items ?? [];
        if (items.length > 0) return items as T[];
        return localize ? fallback.map((item) => localize(item, locale)) : fallback;
      } catch {
        return localize ? fallback.map((item) => localize(item, locale)) : fallback;
      }
    },
    staleTime: 60_000,
  });
}
