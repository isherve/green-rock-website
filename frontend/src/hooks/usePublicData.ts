"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function usePublicList<T>(endpoint: string, params?: Record<string, string>, fallback: T[] = []) {
  return useQuery({
    queryKey: ["public", endpoint, params],
    queryFn: async () => {
      try {
        const res = await api.get(endpoint, { params: { limit: "12", ...params } });
        const data = res.data.data;
        const items = Array.isArray(data) ? data : data?.items ?? [];
        return items.length > 0 ? items : fallback;
      } catch {
        return fallback;
      }
    },
    staleTime: 60_000,
  });
}
