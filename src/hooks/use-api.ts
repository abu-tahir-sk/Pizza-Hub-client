"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/services/http";

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** True when the request finished with an empty result. */
  isEmpty: boolean;
  refetch: () => Promise<void>;
}

/**
 * Small data-fetching hook that standardizes loading, error and empty states.
 * `isEmpty` can be customized so lists and detail views both get useful UI.
 */
export function useApi<T>(
  loader: () => Promise<T>,
  deps: unknown[],
  isEmpty: (data: T) => boolean = (data) =>
    Array.isArray(data) ? data.length === 0 : data == null
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const isEmptyRef = useRef(isEmpty);
  isEmptyRef.current = isEmpty;

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loaderRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    loading,
    error,
    isEmpty: !loading && !error && data !== null && isEmptyRef.current(data),
    refetch: run,
  };
}
