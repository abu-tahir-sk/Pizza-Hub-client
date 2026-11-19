import type { MenuItem } from "@/types";
import type { PaginatedResult } from "@/types/api";
import { apiRequest } from "./http";

export async function fetchMenuItems(params?: {
  search?: string;
  category?: string;
  location?: string;
  sortBy?: "price" | "createdAt";
  sortDir?: "asc" | "desc";
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<MenuItem>> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.category && params.category !== "All") query.set("category", params.category);
  if (params?.location) query.set("location", params.location);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortDir) query.set("sortDir", params.sortDir);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const res = await apiRequest<MenuItem[]>(`/api/menu?${query.toString()}`);
  return {
    items: res.data ?? [],
    total: res.meta?.total ?? res.data?.length ?? 0,
    totalPages: res.meta?.totalPages ?? 1,
  };
}

export async function fetchFeaturedMenu(): Promise<MenuItem[]> {
  const res = await apiRequest<MenuItem[]>("/api/menu/featured");
  return res.data ?? [];
}

export async function fetchMenuItemById(id: string): Promise<MenuItem | null> {
  const res = await apiRequest<MenuItem | null>(`/api/menu/${id}`);
  return res.data ?? null;
}

export async function fetchVendorMenuItems(): Promise<MenuItem[]> {
  const res = await apiRequest<MenuItem[]>("/api/menu/vendor/my-items");
  return res.data ?? [];
}

export async function createMenuItem(data: {
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}): Promise<MenuItem> {
  const res = await apiRequest<MenuItem>("/api/menu", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function updateMenuItem(
  id: string,
  data: Partial<Pick<MenuItem, "itemName" | "category" | "description" | "price" | "location" | "images">> & {
    status?: "active" | "inactive";
  }
): Promise<MenuItem> {
  const res = await apiRequest<MenuItem>(`/api/menu/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function deleteMenuItem(id: string): Promise<void> {
  await apiRequest(`/api/menu/${id}`, { method: "DELETE" });
}
