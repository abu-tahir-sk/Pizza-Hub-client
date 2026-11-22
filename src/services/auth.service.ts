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

async function requestToken(explicitSessionToken?: string): Promise<{ token: string; user: User } | null> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (explicitSessionToken) {
      headers["x-session-token"] = explicitSessionToken;
    }
    const url = explicitSessionToken
      ? `${API_BASE_URL}/api/auth-extra/token?session_token=${encodeURIComponent(explicitSessionToken)}`
      : `${API_BASE_URL}/api/auth-extra/token`;

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers,
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      success: boolean;
      data: { token: string; user: User };
    };
    clientToken = json.data.token;
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pizzahub:jwt_token", json.data.token);
      }
    } catch {
      // ignore storage access errors
    }
    return json.data;
  } catch {
    return null;
  }
}

function getTokenBridge(explicitSessionToken?: string): Promise<{ token: string; user: User } | null> {
  if (explicitSessionToken) {
    return requestToken(explicitSessionToken);
  }
  if (!tokenRequest) {
    tokenRequest = requestToken().finally(() => {
      tokenRequest = null;
    });
  }
  return tokenRequest;
}

export async function ensureToken(): Promise<string | null> {
  if (clientToken) return clientToken;
  try {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("pizzahub:jwt_token");
      if (stored) {
        clientToken = stored;
        return clientToken;
      }
    }
  } catch {
    // ignore
  }
  const result = await getTokenBridge();
  return result?.token ?? null;
}

/** Discard the cached token and re-issue it from the Better Auth session. */
export async function refreshToken(explicitSessionToken?: string): Promise<string | null> {
  clientToken = null;
  tokenRequest = null;
  try {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pizzahub:jwt_token");
    }
  } catch {
    // ignore
  }
  const result = await getTokenBridge(explicitSessionToken);
  return result?.token ?? null;
}

/** Returns the signed-in user (role, block state, plan) from the verified session. */
export async function getSessionUser(explicitSessionToken?: string): Promise<User | null> {
  const result = await getTokenBridge(explicitSessionToken);
  return result?.user ?? null;
}

export function setApiToken(token: string | null): void {
  clientToken = token;
  try {
    if (typeof window !== "undefined") {
      if (token) sessionStorage.setItem("pizzahub:jwt_token", token);
      else sessionStorage.removeItem("pizzahub:jwt_token");
    }
  } catch {
    // ignore
  }
}

export function getApiToken(): string | null {
  return clientToken;
}

export function clearToken(): void {
  clientToken = null;
  try {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pizzahub:jwt_token");
    }
  } catch {
    // ignore
  }
}
