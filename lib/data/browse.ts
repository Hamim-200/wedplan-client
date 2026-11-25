import { API_URL } from "@/lib/api";
import type { Pagination, Service } from "@/lib/types";

export interface BrowseResponse {
  services: Service[];
  pagination: Pagination;
}

export async function fetchServices(params: URLSearchParams): Promise<BrowseResponse> {
  const response = await fetch(`${API_URL}/api/services?${params.toString()}`);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? "Could not load services");
  }
  return data as BrowseResponse;
}

export async function fetchLocations(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/api/services/locations`);
    if (!response.ok) return [];
    const data = (await response.json()) as { locations: string[] };
    return data.locations;
  } catch {
    return [];
  }
}