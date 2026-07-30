const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Paginated<T> = { items: T[] };

export async function fetchPublic<T>(
  path: string,
  params?: Record<string, string>,
  revalidate = 60
): Promise<T[]> {
  try {
    const url = new URL(`${API_URL}${path}`);
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
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
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
