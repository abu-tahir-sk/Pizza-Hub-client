import { API_BASE_URL } from "@/config/env";
import type { ApiEnvelope } from "@/types/api";
import { ensureToken, refreshToken } from "./auth.service";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Single fetch wrapper for every backend call. Handles credentials, the
 * bearer token, one automatic token refresh on 401, and the shared response
 * envelope. All failures are normalized to ApiError.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiEnvelope<T>> {
  const isForm = options.body instanceof FormData;

  const doFetch = (token: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string>),
      },
    });

  let res = await doFetch(await ensureToken());

  if (res.status === 401) {
    const fresh = await refreshToken();
    if (fresh) res = await doFetch(fresh);
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok || !json?.success) {
    throw new ApiError(
      res.status,
      json?.message || `Request failed with status ${res.status}`,
      json?.errors
    );
  }

  return json;
}
