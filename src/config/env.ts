/**
 * Public runtime configuration for the client.
 *
 * Only NEXT_PUBLIC_* variables may be referenced here — they are inlined at
 * build time by Next.js. Secrets must never be added to this module.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const APP_NAME = "PizzaHub";
