import type { MenuItemStatus, Transaction, User, MenuItem } from "@/types";
import type { PaginatedResult } from "@/types/api";
import { apiRequest } from "./http";

export interface AdminOverview {
  totalUsers: number;
  vendors: number;
  customers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
  totalRevenue: number;
}

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const res = await apiRequest<AdminOverview>("/api/admin/overview");
  return res.data!;
}

export async function fetchAdminUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<{ users: User[]; total: number; totalPages: number }> {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.role) q.set("role", params.role);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const res = await apiRequest<User[]>(`/api/admin/users?${q.toString()}`);
  return {
    users: res.data ?? [],
    total: res.meta?.total ?? 0,
    totalPages: res.meta?.totalPages ?? 1,
  };
}

export async function setAdminUserBlockStatus(
  userId: string,
  isBlocked: boolean
): Promise<User> {
  const res = await apiRequest<User>(`/api/admin/users/${userId}/block-status`, {
    method: "PATCH",
    body: JSON.stringify({ isBlocked }),
  });
  return res.data!;
}

export async function fetchAdminMenuItems(params?: {
  search?: string;
  status?: MenuItemStatus | "all";
  category?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<MenuItem>> {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.status && params.status !== "all") q.set("status", params.status);
  if (params?.category) q.set("category", params.category);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const res = await apiRequest<MenuItem[]>(`/api/admin/menu-items?${q.toString()}`);
  return {
    items: res.data ?? [],
    total: res.meta?.total ?? 0,
    totalPages: res.meta?.totalPages ?? 1,
  };
}

export async function setAdminMenuItemStatus(
  itemId: string,
  status: "approved" | "rejected" | "inactive",
  rejectionReason?: string
): Promise<MenuItem> {
  const res = await apiRequest<MenuItem>(`/api/admin/menu-items/${itemId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, rejectionReason }),
  });
  return res.data!;
}

export async function deleteAdminMenuItem(itemId: string): Promise<void> {
  await apiRequest(`/api/admin/menu-items/${itemId}`, { method: "DELETE" });
}

export async function fetchAdminTransactions(params?: {
  status?: Transaction["status"] | "all";
  page?: number;
  limit?: number;
}): Promise<{
  transactions: Transaction[];
  total: number;
  totalPages: number;
  totalRevenue: number;
}> {
  const q = new URLSearchParams();
  if (params?.status && params.status !== "all") q.set("status", params.status);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const res = await apiRequest<Transaction[]>(`/api/admin/transactions?${q.toString()}`);
  return {
    transactions: res.data ?? [],
    total: res.meta?.total ?? 0,
    totalPages: res.meta?.totalPages ?? 1,
    totalRevenue: res.meta?.totalRevenue ?? 0,
  };
}
