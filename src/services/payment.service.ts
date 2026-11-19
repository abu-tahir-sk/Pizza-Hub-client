import type { Transaction } from "@/types";
import { apiRequest } from "./http";

export async function createCheckoutSession(): Promise<{ sessionId: string; url: string }> {
  const res = await apiRequest<{ sessionId: string; url: string }>(
    "/api/payments/create-checkout-session",
    { method: "POST" }
  );
  return res.data!;
}

export async function verifyPaymentSession(sessionId: string): Promise<{
  paymentStatus: string;
  transaction: Transaction | null;
}> {
  const res = await apiRequest<{ paymentStatus: string; transaction: Transaction | null }>(
    `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`
  );
  return res.data!;
}

export async function fetchMyTransactions(): Promise<Transaction[]> {
  const res = await apiRequest<Transaction[]>("/api/payments/my-transactions");
  return res.data ?? [];
}
