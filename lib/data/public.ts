import { API_URL } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import type { CategoryCount, Service } from "@/lib/types";

// Fetches public data on the server. Never throws: returns a fallback on any problem.
async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getFeaturedServices(limit = 6): Promise<Service[]> {
  const data = await getJson<{ services: Service[] }>(
    `/api/services/featured?limit=${limit}`,
    { services: [] }
  );
  return data.services;
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const fallback = SERVICE_CATEGORIES.map((name) => ({ name, count: 0 }));
  const data = await getJson<{ categories: CategoryCount[] }>(
    "/api/services/categories",
    { categories: fallback }
  );
  return data.categories;
}