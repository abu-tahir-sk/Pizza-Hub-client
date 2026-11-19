"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CheckCircle2, Clock, Loader2, ReceiptText, XCircle } from "lucide-react";
import type { Transaction } from "@/types";
import { verifyPaymentSession, ApiError } from "@/lib/api";
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

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      if (!sessionId) {
        setError("Missing checkout session. If you completed a payment, check your subscription page.");
        setLoading(false);
        return;
      }
      try {
        const res = await verifyPaymentSession(sessionId);
        if (!cancelled) {
          setStatus(res.paymentStatus);
          setTransaction(res.transaction);
          setError(null);
          if (res.paymentStatus === "paid") {
            try {
              confetti({
                particleCount: 90,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "We could not verify this payment session. Please check your subscription page."
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
  }, [sessionId]);

  if (loading) return <PaymentSkeleton />;

  const paid = status === "paid";

  return (
    <div className="min-h-screen bg-[#fffaf3] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-xl">
        <Card className="border-[#efe1d0] text-center">
          <CardContent className="space-y-4 p-8 sm:p-10">
            <span
              className={`mx-auto grid size-16 place-items-center rounded-full ${
                paid ? "bg-emerald-100 text-emerald-600" : error ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
              }`}
            >
              {paid ? (
                <CheckCircle2 className="size-8" />
              ) : error ? (
                <XCircle className="size-8" />
              ) : (
                <Clock className="size-8" />
              )}
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#3b1c12]">
              {paid ? "Payment successful!" : error ? "We couldn't verify this payment" : "Payment processing"}
            </h1>

            <p className="text-sm leading-relaxed text-[#7a5c4d]">
              {paid ? (
                <>
                  Thanks for upgrading to <strong>PizzaHub Premium</strong>. Premium activates only
                  after Stripe confirms the payment through its verified webhook — this usually
                  takes just a few seconds.
                </>
              ) : error ? (
                error
              ) : (
                <>
                  Stripe is still confirming your payment. This page won&apos;t activate Premium on
                  its own; the verified webhook will. Refresh your subscription page in a moment.
                </>
              )}
            </p>

            {transaction ? (
              <div className="mx-auto flex max-w-xs flex-col gap-2 rounded-lg bg-[#fdf3e8] p-4 text-left text-xs text-[#7a5c4d]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <ReceiptText className="size-3.5" /> Plan
                  </span>
                  <span className="capitalize">{transaction.plan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Amount</span>
                  <span className="font-semibold">{formatPrice(transaction.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge
                    variant={
                      transaction.status === "paid"
                        ? "success"
                        : transaction.status === "pending"
                          ? "warning"
                          : "muted"
                    }
                    className="capitalize"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
              <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521]">
                <Link href="/dashboard/vendor/subscription">Go to subscription</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#d9b99e]">
                <Link href="/dashboard/vendor">Back to dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-[#a18573]">
          Premium is granted server-side only. If your plan still shows Free after a minute, contact
          support — no client-side action can activate it.
        </p>
      </div>
    </div>
  );
}

function PaymentSkeleton() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-white p-10">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-40" />
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}
