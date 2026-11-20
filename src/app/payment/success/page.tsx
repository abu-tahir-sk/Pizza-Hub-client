"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Pizza,
  PlusCircle,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { Order, Transaction } from "@/types";
import { verifyPaymentSession, ApiError } from "@/lib/api";
import { verifyOrderPayment } from "@/services/order.service";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

export default function PaymentSuccessPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<PaymentSkeleton />}>
        <SuccessContent />
      </Suspense>
    </AuthGuard>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let pollCount = 0;
    const maxPolls = 5;

    async function verify() {
      if (!sessionId) {
        setError("Missing checkout session. If you completed a payment, check your dashboard.");
        setLoading(false);
        return;
      }

      try {
        if (orderId) {
          // Pizza Order payment verification
          const res = await verifyOrderPayment(orderId, sessionId);
          if (cancelled) return;
          setStatus(res.paymentStatus);
          setOrder(res.order);
          setError(null);

          if (res.paymentStatus === "paid") {
            try {
              confetti({
                particleCount: 110,
                spread: 75,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }
          }
        } else {
          // Vendor Subscription payment verification
          const res = await verifyPaymentSession(sessionId);
          if (cancelled) return;

          setStatus(res.paymentStatus);
          setTransaction(res.transaction);
          setError(null);

          if (res.paymentStatus === "paid") {
            try {
              confetti({
                particleCount: 110,
                spread: 75,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }
          }

          if (res.transaction?.status === "pending" && pollCount < maxPolls) {
            pollCount += 1;
            setTimeout(() => {
              if (!cancelled) void verify();
            }, 2500);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "We could not verify this payment session. Please check your dashboard."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId, orderId]);

  if (loading) return <PaymentSkeleton />;

  const isPaid = status === "paid" || transaction?.status === "paid" || order?.paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-16 sm:px-6 transition-colors">
      <div className="mx-auto max-w-xl">
        <Card className="border-border bg-card text-center shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="space-y-5 p-8 sm:p-10">
            <span
              className={`mx-auto grid size-20 place-items-center rounded-full shadow-inner ${
                isPaid
                  ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : error
                    ? "bg-red-500/10 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                    : "bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
              }`}
            >
              {isPaid ? (
                <CheckCircle2 className="size-10" />
              ) : error ? (
                <XCircle className="size-10" />
              ) : (
                <Clock className="size-10 animate-spin" />
              )}
            </span>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c8402b]">
                <Sparkles className="size-3.5" />
                {orderId ? "Pizza Order Confirmed" : "PizzaHub Subscription"}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {isPaid
                  ? orderId
                    ? "Payment Received & Order Placed!"
                    : "Payment Verified & Complete!"
                  : error
                    ? "Verification Issue"
                    : "Payment Processing…"}
              </h1>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {isPaid ? (
                orderId ? (
                  <>
                    Thank you! Your online payment was successful and your pizza order is now confirmed.
                    The kitchen is notified and preparing your fresh pizza!
                  </>
                ) : (
                  <>
                    Congratulations! Your <strong>PizzaHub Premium</strong> subscription is now active.
                    You have unlocked unlimited menu publishing, featured placement, and the verified vendor badge.
                  </>
                )
              ) : error ? (
                error
              ) : (
                <>
                  Stripe is finalizing your transaction. Your order will update automatically once verified.
                </>
              )}
            </p>

            {order ? (
              <div className="mx-auto flex max-w-sm flex-col gap-2.5 rounded-xl bg-muted/60 border border-border p-4 text-left text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Pizza className="size-3.5 text-[#c8402b]" /> Order Item
                  </span>
                  <span className="font-bold text-foreground">
                    {typeof order.itemId === "object" ? order.itemId.itemName : "Pizza"} ({order.quantity || 1}x)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Amount Paid</span>
                  <span className="font-bold text-foreground text-sm">
                    {formatPrice(order.totalAmount || (typeof order.itemId === "object" ? order.itemId.price : 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Method</span>
                  <Badge variant="success" className="font-semibold">
                    💳 Paid Online (Stripe)
                  </Badge>
                </div>
              </div>
            ) : transaction ? (
              <div className="mx-auto flex max-w-sm flex-col gap-2.5 rounded-xl bg-muted/60 border border-border p-4 text-left text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <ReceiptText className="size-3.5 text-[#c8402b]" /> Plan
                  </span>
                  <span className="font-bold uppercase text-[#c8402b]">{transaction.plan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Amount Paid</span>
                  <span className="font-bold text-foreground text-sm">{formatPrice(transaction.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Status</span>
                  <Badge
                    variant={
                      transaction.status === "paid"
                        ? "success"
                        : transaction.status === "pending"
                          ? "warning"
                          : "muted"
                    }
                    className="capitalize font-semibold"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-2.5 pt-3 sm:flex-row sm:justify-center">
              {orderId ? (
                <>
                  <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521] text-white font-semibold">
                    <Link href="/dashboard/customer/orders">
                      <ShoppingBag className="size-4 mr-2" /> View My Orders
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted font-semibold">
                    <Link href="/menu">Browse More Pizzas</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521] text-white font-semibold">
                    <Link href="/dashboard/vendor/items/new">
                      <PlusCircle className="size-4 mr-2" /> Publish Menu Item
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted font-semibold">
                    <Link href="/dashboard/vendor/subscription">View Subscription</Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {orderId
            ? "Your receipt and order confirmation have been saved to your account."
            : "Premium is granted exclusively server-side via Stripe webhooks."}
        </p>
      </div>
    </div>
  );
}

function PaymentSkeleton() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 shadow-sm">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-40" />
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}
