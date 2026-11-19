/** Shared response shapes. Mirrors `server/src/utils/api-response.ts`. */
export interface ApiMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  totalRevenue?: number;
  time?: string;
  [key: string]: unknown;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  meta?: ApiMeta;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
}
