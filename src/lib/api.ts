/**
 * Backwards-compatible barrel.
 *
 * The implementation now lives in `src/services/*` (one module per feature).
 * Existing imports from `@/lib/api` continue to work unchanged.
 */
export * from "@/services";
