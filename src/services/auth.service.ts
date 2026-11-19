import { API_BASE_URL } from "@/config/env";
import type { User } from "@/types";

/**
 * JWT lifecycle.
 *
 * The token is held in memory only. On reload it is re-issued silently via
 * the server's session→JWT bridge, which validates the Better Auth cookie.
 * Concurrent callers share one in-flight bridge request.
 */
let clientToken: string | null = null;
let tokenRequest: Promise<{ token: string; user: User } | null> | null = null;

async function requestToken(): Promise<{ token: string; user: User } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth-extra/token`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      success: boolean;
      data: { token: string; user: User };
    };
    clientToken = json.data.token;
    return json.data;
  } catch {
    return null;
  }
}

function getTokenBridge(): Promise<{ token: string; user: User } | null> {
  if (!tokenRequest) {
    tokenRequest = requestToken().finally(() => {
      tokenRequest = null;
    });
  }
  return tokenRequest;
}

export async function ensureToken(): Promise<string | null> {
  if (clientToken) return clientToken;
  const result = await getTokenBridge();
  return result?.token ?? null;
}

/** Discard the cached token and re-issue it from the Better Auth session. */
export async function refreshToken(): Promise<string | null> {
  clientToken = null;
  tokenRequest = null;
  const result = await getTokenBridge();
  return result?.token ?? null;
}

/** Returns the signed-in user (role, block state, plan) from the verified session. */
export async function getSessionUser(): Promise<User | null> {
  const result = await getTokenBridge();
  return result?.user ?? null;
}

export function setApiToken(token: string | null): void {
  clientToken = token;
}

export function getApiToken(): string | null {
  return clientToken;
}

export function clearToken(): void {
  clientToken = null;
}
