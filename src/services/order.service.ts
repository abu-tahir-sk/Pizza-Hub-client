import type { Order } from "@/types";
import { apiRequest } from "./http";

export interface PlaceOrderInput {
  itemId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  quantity?: number;
}

export interface PlaceOrderResult {
  order: Order;
  checkoutUrl?: string | null;
}

export async function placeOrder(orderData: PlaceOrderInput): Promise<PlaceOrderResult> {
  const res = await apiRequest<PlaceOrderResult | Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
  const data = res.data!;
  if ("order" in data) {
    return data as PlaceOrderResult;
  }
  return { order: data as Order, checkoutUrl: null };
}

export async function fetchCustomerOrders(): Promise<Order[]> {
  const res = await apiRequest<Order[]>("/api/orders/my");
  return res.data ?? [];
}

export async function fetchVendorOrders(): Promise<Order[]> {
  const res = await apiRequest<Order[]>("/api/orders/vendor");
  return res.data ?? [];
}

export async function fetchOrderById(id: string): Promise<Order> {
  const res = await apiRequest<Order>(`/api/orders/${id}`);
  return res.data!;
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const res = await apiRequest<Order>(`/api/orders/${orderId}/cancel`, { method: "PATCH" });
  return res.data!;
}

export async function decideOrder(
  orderId: string,
  status: "accepted" | "rejected"
): Promise<Order> {
  const res = await apiRequest<Order>(`/api/orders/${orderId}/decision`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return res.data!;
}

export interface OrderStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled?: number;
}

export async function fetchOrderStats(): Promise<OrderStats> {
  const res = await apiRequest<OrderStats>("/api/orders/stats");
  return res.data!;
}
