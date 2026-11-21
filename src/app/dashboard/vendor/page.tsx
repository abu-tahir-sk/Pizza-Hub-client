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
import {
  CheckCircle2,
  ClipboardList,
  CreditCard,
  PlusCircle,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import type { MenuItem, Order } from "@/types";
import type { AppUser } from "@/lib/types";
import { fetchVendorMenuItems, fetchVendorOrders } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { StatCard, PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/utils";

export default function VendorOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user as unknown as AppUser | undefined;

  const [items, setItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [menu, vendorOrders] = await Promise.all([
          fetchVendorMenuItems(),
          fetchVendorOrders(),
        ]);
        if (!cancelled) {
          setItems(menu);
          setOrders(vendorOrders);
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

  const approvedItems = items.filter((i) => i.status === "approved").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const acceptedOrders = orders.filter((o) => o.status === "accepted").length;
  const rejectedOrders = orders.filter((o) => o.status === "rejected").length;

  const chartData = [
    { name: "Pending", count: pendingOrders, fill: "#f59e0b" },
    { name: "Accepted", count: acceptedOrders, fill: "#10b981" },
    { name: "Rejected", count: rejectedOrders, fill: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Chef"}`}
        description={
          user?.businessName
            ? `Managing ${user.businessName}`
            : "Here's what's happening at your restaurant today."
        }
        action={
          <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521]">
            <Link href="/dashboard/vendor/items/new">
              <PlusCircle className="size-4" /> Add Menu Item
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
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Menu Items" value={items.length} icon={UtensilsCrossed} />
          <StatCard
            label="Active Items"
            value={approvedItems}
            icon={CheckCircle2}
            tone="success"
            hint={user?.subscriptionPlan === "premium" ? "Unlimited plan" : "Free plan · max 3"}
          />
          <StatCard label="Pending Orders" value={pendingOrders} icon={ClipboardList} tone="warning" />
          <StatCard label="Accepted Orders" value={acceptedOrders} icon={CheckCircle2} tone="info" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Orders by status</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : orders.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No orders yet — once a customer orders, it will appear here.
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
            <CardTitle className="text-base text-foreground">Subscription</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Current plan
              </p>
              <p className="mt-1 text-xl font-extrabold capitalize text-foreground">
                {user?.subscriptionPlan ?? "free"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {user?.subscriptionPlan === "premium"
                  ? "Unlimited menu items, Premium badge & featured placement."
                  : "Up to 3 menu items. Upgrade for unlimited listings."}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/vendor/subscription">Manage Subscription</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base text-foreground">Recent orders</CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-[#c8402b]">
            <Link href="/dashboard/vendor/orders">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {orders.slice(0, 5).map((order) => {
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
                    <OrderStatusBadge status={order.status} />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const variants = {
    pending: "warning",
    accepted: "success",
    rejected: "destructive",
    cancelled: "muted",
  } as const;
  return (
    <Badge variant={variants[status]} className="capitalize">
      {status === "rejected" ? <XCircle className="size-3" /> : null}
      {status}
    </Badge>
  );
}
