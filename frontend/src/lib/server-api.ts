import { getApiBaseUrl } from "@/lib/api-url";
import { getServerLocale } from "@/lib/server-locale";

const API_URL = getApiBaseUrl();

type Paginated<T> = { items: T[] };

export async function fetchPublic<T>(
  path: string,
  params?: Record<string, string>,
  revalidate = 60
): Promise<T[]> {
  try {
    const locale = await getServerLocale();
    const url = new URL(`${API_URL}${path}`);
    url.searchParams.set("locale", locale);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString(), {
      next: { revalidate },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json.data as T[] | Paginated<T>;
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && "items" in data) return data.items;
    return [];
  } catch {
    return [];
  }
}

export async function fetchPublicOne<T>(
  path: string,
  revalidate = 60
): Promise<T | null> {
  try {
    const locale = await getServerLocale();
    const url = new URL(`${API_URL}${path}`);
    url.searchParams.set("locale", locale);
    const res = await fetch(url.toString(), { next: { revalidate } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

export function withFallback<T>(apiData: T[], fallback: T[]): T[] {
  return apiData.length > 0 ? apiData : fallback;
}

export async function withLocalizedFallback<T extends Record<string, unknown>>(
  apiData: T[],
  fallback: T[],
  localize: (item: T, locale: Awaited<ReturnType<typeof getServerLocale>>) => T
): Promise<T[]> {
  if (apiData.length > 0) return apiData;
  const locale = await getServerLocale();
  return fallback.map((item) => localize(item, locale));
}
