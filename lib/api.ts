import { authClient } from "./auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiClientError extends Error {
  status: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(status: number, message: string, errors?: ApiClientError["errors"]) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export function clearTokenCache() {
  cachedToken = null;
}

async function getToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const { data } = await authClient.token();
  if (!data?.token) return null;

  cachedToken = { value: data.token, expiresAt: Date.now() + 10 * 60 * 1000 };
  return data.token;
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  auth?: boolean; // send the JWT (default: false)
  body?: unknown; // plain object (sent as JSON) or FormData
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth = false, body, headers, ...rest } = options;
  const finalHeaders = new Headers(headers);

  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiClientError(401, "Please sign in to continue");
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let finalBody: BodyInit | undefined;
  if (body instanceof FormData) {
    finalBody = body; // the browser sets the multipart header itself
  } else if (body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
    finalBody = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: finalBody,
    });
  } catch {
    throw new ApiClientError(0, "Cannot reach the server. Please try again.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) clearTokenCache();
    throw new ApiClientError(
      response.status,
      data?.message ?? "Something went wrong",
      data?.errors
    );
  }

  return data as T;
}