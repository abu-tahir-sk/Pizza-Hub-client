/**
 * Public runtime configuration for the client.
 *
 * Only NEXT_PUBLIC_* variables may be referenced here — they are inlined at
 * build time by Next.js. Secrets must never be added to this module.
 */
/**
 * Public runtime configuration for the client.
 *
 * Only NEXT_PUBLIC_* variables may be referenced here — they are inlined at
 * build time by Next.js.
 *
 * If NEXT_PUBLIC_API_URL is unset or points to localhost in a production/remote
 * environment, we automatically route to the live production server.
 */
function resolveApiBaseUrl(): string {
  // 1. Explicit env variable (if set to a remote domain)
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }

  // 2. Client-side browser check: if running on Vercel or any remote host, use live backend
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://pizza-hub-server-theta.vercel.app";
  }

  // 3. Server-side production build check
  if (process.env.NODE_ENV === "production") {
    return "https://pizza-hub-server-theta.vercel.app";
  }

  // 4. Default for local development
  return envUrl || "http://localhost:5000";
}

export const API_BASE_URL = resolveApiBaseUrl();

export const APP_NAME = "PizzaHub";
