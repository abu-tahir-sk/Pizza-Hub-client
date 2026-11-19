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
import { CheckCircle2, Clock, ShoppingBag, XCircle } from "lucide-react";
import type { Order } from "@/types";
import type { AppUser } from "@/lib/types";
import { fetchCustomerOrders, fetchOrderStats, type OrderStats } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { PageHeading, StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/utils";

export default function CustomerOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user as unknown as AppUser | undefined;

  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        title={`Hello, ${user?.name?.split(" ")[0] ?? "Pizza Lover"} 🍕`}
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
        <Card className="border-[#efe1d0]">
          <CardHeader>
            <CardTitle className="text-base">Your order activity</CardTitle>
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee2d4" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, borderColor: "#efdcc9", fontSize: 12 }}
                      cursor={{ fill: "#fbf2e7" }}
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

        <Card className="border-[#efe1d0]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent orders</CardTitle>
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
              <div className="divide-y divide-[#f3e6d8]">
                {orders.slice(0, 4).map((order) => {
                  const item = typeof order.itemId === "object" ? order.itemId : null;
                  return (
                    <div key={order._id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#3b1c12]">
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
    </div>
  );
}
