"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, Clock, Loader2, ShoppingBag, Sparkles, Store, XCircle } from "lucide-react";
import type { Order } from "@/types";
import type { AppUser } from "@/lib/types";
import { fetchCustomerOrders, fetchOrderStats, becomeVendor, refreshToken, type OrderStats } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeading, StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/utils";

export default function CustomerOverviewPage() {
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const user = session?.user as unknown as AppUser | undefined;

  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Become a Vendor state
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [upgrading, setUpgrading] = useState(false);

  async function handleBecomeVendor(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim() || businessName.trim().length < 2) {
      toast.error("Please enter a valid restaurant or business name (at least 2 characters).");
      return;
    }
    setUpgrading(true);
    try {
      await becomeVendor(businessName.trim());
      await refreshToken();
      await refetch();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("pizzahub-auth-change"));
      }
      toast.success("Congratulations! You are now a Vendor. Welcome to your Vendor Dashboard!");
      setVendorDialogOpen(false);
      router.push("/dashboard/vendor");
      router.refresh();
    } catch {
      toast.error("Could not upgrade to Vendor account right now. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [orderStats, myOrders] = await Promise.all([fetchOrderStats(), fetchCustomerOrders()]);
        if (!cancelled) {
          setStats(orderStats);
          setOrders(myOrders);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Could not load your dashboard data. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = [
    { name: "Pending", count: stats?.pending ?? 0, fill: "#f59e0b" },
    { name: "Accepted", count: stats?.accepted ?? 0, fill: "#10b981" },
    { name: "Rejected", count: stats?.rejected ?? 0, fill: "#ef4444" },
    { name: "Cancelled", count: stats?.cancelled ?? 0, fill: "#a8a29e" },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title={`Hello, ${user?.name?.split(" ")[0] ?? "Pizza Lover"}`}
        description="Track your orders and discover your next favourite slice."
        action={
          <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521]">
            <Link href="/menu">
              <ShoppingBag className="size-4" /> Browse Menu
            </Link>
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Orders" value={stats?.total ?? 0} icon={ShoppingBag} />
          <StatCard label="Pending" value={stats?.pending ?? 0} icon={Clock} tone="warning" />
          <StatCard
            label="Accepted"
            value={stats?.accepted ?? 0}
            icon={CheckCircle2}
            tone="success"
          />
          <StatCard
            label="Rejected"
            value={stats?.rejected ?? 0}
            icon={XCircle}
            tone="danger"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Your order activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (stats?.total ?? 0) === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No orders yet — browse the menu and place your first order!
              </p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        borderColor: "var(--border)",
                        backgroundColor: "var(--card)",
                        color: "var(--foreground)",
                        fontSize: 12,
                      }}
                      cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-foreground">Recent orders</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-[#c8402b]">
              <Link href="/dashboard/customer/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : orders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {orders.slice(0, 4).map((order) => {
                  const item = typeof order.itemId === "object" ? order.itemId : null;
                  return (
                    <div key={order._id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {item?.itemName ?? "Menu item"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.deliveryDate)} · {formatPrice(item?.price ?? 0)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          order.status === "accepted"
                            ? "success"
                            : order.status === "pending"
                              ? "warning"
                              : order.status === "rejected"
                                ? "destructive"
                                : "muted"
                        }
                        className="capitalize"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Become a Vendor Promotion Card & Upgrade Dialog */}
      <Card className="border-[#c8402b]/20 bg-gradient-to-r from-[#c8402b]/5 via-[#f0a23c]/5 to-transparent">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#c8402b]/10 text-[#c8402b]">
              <Store className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Want to sell your pizzas on PizzaHub?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Switch your account to a Vendor to list artisan pizzas, receive live orders, and grow your local pizzeria.
              </p>
            </div>
          </div>

          <Dialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#c8402b] hover:bg-[#ad3521] text-white shrink-0 font-bold">
                <Store className="size-4 mr-2" /> Become a Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleBecomeVendor} className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Store className="size-5 text-[#c8402b]" /> Register as a Vendor
                  </DialogTitle>
                  <DialogDescription>
                    Enter your restaurant or business name to activate your vendor dashboard and begin publishing menu items.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 py-2">
                  <Label htmlFor="business-name">Restaurant / Business Name</Label>
                  <Input
                    id="business-name"
                    placeholder="e.g. Napoli Wood-Fired Pizzeria"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    maxLength={80}
                    autoFocus
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This name will appear on all your menu items and customer receipts.
                  </p>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setVendorDialogOpen(false)}
                    disabled={upgrading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={upgrading}
                    className="bg-[#c8402b] hover:bg-[#ad3521] text-white font-bold"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> Activating…
                      </>
                    ) : (
                      "Confirm & Open Vendor Dashboard"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
