/**
 * Public API of the client service layer.
 * Prefer importing from `@/services` in new code; `@/lib/api` remains as a
 * compatibility shim for existing pages.
 */
export { API_BASE_URL } from "@/config/env";
export * from "./http";
export * from "./auth.service";
export * from "./menu.service";
export * from "./upload.service";
export * from "./order.service";
export * from "./payment.service";
export * from "./admin.service";
export * from "./user.service";
