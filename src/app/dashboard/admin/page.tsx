"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
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
  ArrowRight,
  ClipboardList,
  CreditCard,
  DollarSign,
  Loader2,
  Pizza,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import type { Order, OrderStatus, MenuItem, User } from "@/types";
import {
  fetchAdminOverview,
  fetchAdminOrders,
  setAdminOrderStatus,
  type AdminOverview,
  ApiError,
} from "@/lib/api";
import { PageHeading, StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [overview, ordersRes] = await Promise.all([
          fetchAdminOverview(),
          fetchAdminOrders({ limit: 6 }),
        ]);
        if (!cancelled) {
          setData(overview);
          setRecentOrders(ordersRes.items);
        }
      } catch {
        if (!cancelled) setError("Could not load platform statistics. Please refresh.");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingOrders(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
    setBusyId(orderId);
    try {
      const updated = await setAdminOrderStatus(orderId, nextStatus);
      setRecentOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o))
      );
      toast.success(`Order status updated to ${nextStatus}`);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update order status"
      );
    } finally {
      setBusyId(null);
    }
  }

  const userChart = [
    { name: "Customers", count: data?.customers ?? 0, fill: "#c8402b" },
    { name: "Vendors", count: data?.vendors ?? 0, fill: "#f0a23c" },
  ];
  const contentChart = [
    { name: "Menu items", count: data?.totalMenuItems ?? 0, fill: "#0ea5e9" },
    { name: "Pending review", count: data?.pendingMenuItems ?? 0, fill: "#f59e0b" },
    { name: "Customer orders", count: data?.totalOrders ?? recentOrders.length, fill: "#8b5cf6" },
    { name: "Paid txs", count: data?.totalTransactions ?? 0, fill: "#10b981" },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Platform Overview"
        description="Monitor users, menu moderation, customer pizza orders, and subscription revenue."
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/admin/orders">
                <ClipboardList className="mr-1.5 size-4" /> All Orders
              </Link>
            </Button>
            <Button asChild className="bg-[#c8402b] hover:bg-[#a83422] text-white">
              <Link href="/dashboard/admin/items">Review items</Link>
            </Button>
          </div>
        }
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Users" value={data?.totalUsers ?? 0} icon={Users} />
          <StatCard label="Vendors" value={data?.vendors ?? 0} icon={Store} tone="warning" />
          <StatCard label="Customers" value={data?.customers ?? 0} icon={Users} tone="info" />
          <StatCard
            label="Total Orders"
            value={data?.totalOrders ?? recentOrders.length}
            icon={ClipboardList}
            tone="info"
          />
          <StatCard label="Menu Items" value={data?.totalMenuItems ?? 0} icon={UtensilsCrossed} />
          <StatCard
            label="Pending Items"
            value={data?.pendingMenuItems ?? 0}
            icon={UtensilsCrossed}
            tone="danger"
          />
          <StatCard
            label="Transactions"
            value={data?.totalTransactions ?? 0}
            icon={CreditCard}
            tone="success"
            hint={`${formatPrice(data?.totalRevenue ?? 0)} revenue`}
          />
        </div>
      )}

      {/* Orders Table on Dashboard Overview */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              Recent Pizza Orders
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live customer orders in table format with quick status management.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
            <Link href="/dashboard/admin/orders">
              View all orders <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-2">
          {loadingOrders ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <Pizza className="mx-auto mb-2 size-8 text-muted-foreground/50" />
              No customer orders placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[200px]">Pizza</TableHead>
                    <TableHead className="w-[160px]">Customer</TableHead>
                    <TableHead className="w-[160px]">Restaurant / Vendor</TableHead>
                    <TableHead className="w-[180px]">Delivery Address</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[150px] text-right">Change Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => {
                    const item =
                      typeof order.itemId === "object" ? (order.itemId as MenuItem) : null;
                    const customer =
                      typeof order.customerId === "object" ? (order.customerId as User) : null;
                    const vendor =
                      typeof order.vendorId === "object" ? (order.vendorId as User) : null;
                    const isUpdating = busyId === order._id;

                    return (
                      <TableRow key={order._id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="relative size-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                              {item?.images?.[0] ? (
                                <Image
                                  src={item.images[0]}
                                  alt={item.itemName || "Pizza"}
                                  fill
                                  sizes="36px"
                                  className="object-cover"
                                />
                              ) : (
                                <Pizza className="m-auto size-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="line-clamp-1 text-xs font-semibold text-foreground">
                                {item?.itemName ?? "Pizza"}
                              </p>
                              <p className="text-[11px] font-bold text-[#c8402b]">
                                {formatPrice(item?.price ?? 0)}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <p className="text-xs font-medium text-foreground">
                            {customer?.name ?? "Customer"}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {customer?.email ?? "—"}
                          </p>
                        </TableCell>

                        <TableCell>
                          <p className="text-xs font-medium text-foreground">
                            {vendor?.businessName || vendor?.name || "PizzaHub Official"}
                          </p>
                        </TableCell>

                        <TableCell>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {order.deliveryAddress}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {formatDate(order.deliveryDate)}
                          </p>
                        </TableCell>

                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>

                        <TableCell className="text-right">
                          {isUpdating ? (
                            <Loader2 className="ml-auto size-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Select
                              value={order.status}
                              onValueChange={(val) =>
                                void handleStatusChange(order._id, val as OrderStatus)
                              }
                            >
                              <SelectTrigger className="h-7 w-28 text-xs font-medium ml-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent align="end">
                                <SelectItem value="pending" className="text-amber-600">
                                  ⏳ Pending
                                </SelectItem>
                                <SelectItem value="accepted" className="text-emerald-600">
                                  ✅ Accepted
                                </SelectItem>
                                <SelectItem value="rejected" className="text-red-600">
                                  ❌ Rejected
                                </SelectItem>
                                <SelectItem value="cancelled" className="text-stone-500">
                                  🚫 Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Registered users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userChart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="currentColor" className="text-muted-foreground" />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} stroke="currentColor" className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)", fontSize: 12 }}
                      cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {userChart.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Platform content</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contentChart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="currentColor" className="text-muted-foreground" />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} stroke="currentColor" className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)", fontSize: 12 }}
                      cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {contentChart.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              <DollarSign className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Premium revenue
              </p>
              <p className="text-2xl font-extrabold text-foreground">
                {formatPrice(data?.totalRevenue ?? 0)}
              </p>
            </div>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Revenue is calculated only from transactions marked <strong>paid</strong> by the verified
            Stripe webhook. Admins cannot edit payment records.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { variant: "warning" | "success" | "destructive" | "muted"; label: string }> = {
    pending: { variant: "warning", label: "Pending" },
    accepted: { variant: "success", label: "Accepted" },
    rejected: { variant: "destructive", label: "Rejected" },
    cancelled: { variant: "muted", label: "Cancelled" },
  };
  const cfg = map[status] ?? { variant: "muted", label: status };
  return (
    <Badge variant={cfg.variant} className="capitalize">
      {cfg.label}
    </Badge>
  );
}
