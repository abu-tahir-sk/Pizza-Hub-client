"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, CreditCard, Loader2, Sparkles, Star } from "lucide-react";
import type { Transaction } from "@/types";
import type { AppUser } from "@/lib/types";
import { createCheckoutSession, fetchMyTransactions, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatPrice, cn } from "@/lib/utils";

const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium vendor badge on your items",
  "Featured placement on the homepage",
  "All Free plan features",
  "Priority support",
];

const FREE_FEATURES = [
  "Up to 3 active menu items",
  "Basic vendor dashboard",
  "Full order management",
  "Customer messaging",
];

export default function VendorSubscriptionPage() {
  const { data: session } = useSession();
  const user = session?.user as unknown as AppUser | undefined;
  const isPremium = user?.subscriptionPlan === "premium";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchMyTransactions();
        if (!cancelled) setTransactions(data);
      } catch {
        // History is non-critical; checkout still works.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const { url } = await createCheckoutSession();
      // Redirect to Stripe-hosted checkout; Premium activates only after the
      // verified webhook fires server-side.
      window.location.href = url;
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not start checkout. Please try again later.";
      toast.error(msg);
      setUpgrading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Subscription"
        description="Upgrade to Premium for unlimited menu items and promotional placement."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Free</CardTitle>
              {!isPremium ? <Badge variant="secondary">Current plan</Badge> : null}
            </div>
            <p className="text-3xl font-extrabold text-foreground">
              $0 <span className="text-sm font-medium text-muted-foreground">/ forever</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {FREE_FEATURES.map((f) => (
              <p key={f} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> {f}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Premium */}
        <Card className="relative overflow-hidden border-[#c8402b]/40 bg-card ring-1 ring-[#c8402b]/20">
          <div className="absolute right-0 top-0 rounded-bl-xl bg-[#c8402b] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Best value
          </div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-foreground">Premium</CardTitle>
              <Star className="size-4 fill-[#f0a23c] text-[#f0a23c]" />
              {isPremium ? <Badge variant="success">Active</Badge> : null}
            </div>
            <p className="text-3xl font-extrabold text-foreground">
              $29.99 <span className="text-sm font-medium text-muted-foreground">/ 30 days</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {PREMIUM_FEATURES.map((f) => (
                <p key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#c8402b]" /> {f}
                </p>
              ))}
            </div>

            {isPremium ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">
                <p className="font-semibold">Premium is active 🎉</p>
                {user?.subscriptionExpiresAt ? (
                  <p className="mt-1 text-xs">
                    Expires on {formatDateTime(user.subscriptionExpiresAt)}
                  </p>
                ) : null}
              </div>
            ) : (
              <Button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="h-11 w-full bg-[#c8402b] hover:bg-[#ad3521] text-white"
              >
                {upgrading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {upgrading ? "Opening Stripe Checkout…" : "Upgrade to Premium"}
              </Button>
            )}
            <p className="text-center text-xs text-muted-foreground">
              Secure payment via Stripe. Premium activates only after the payment is verified.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <CardTitle className="text-base text-foreground">Payment history</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No payments yet. Your transactions will appear here after checkout.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx._id}>
                    <TableCell className="text-sm">{formatDateTime(tx.createdAt)}</TableCell>
                    <TableCell className="text-sm capitalize">{tx.plan}</TableCell>
                    <TableCell className="text-sm font-semibold">{formatPrice(tx.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.status === "paid"
                            ? "success"
                            : tx.status === "pending"
                              ? "warning"
                              : "muted"
                        }
                        className="capitalize"
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
