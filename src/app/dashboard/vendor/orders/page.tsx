"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Banknote,
  CalendarDays,
  Check,
  Clock,
  LayoutGrid,
  List,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Pizza,
  X,
} from "lucide-react";
import type { Order } from "@/types";
import type { AppUser } from "@/lib/types";
import { decideOrder, fetchVendorOrders, ApiError } from "@/lib/api";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";

type Filter = "all" | "pending" | "accepted" | "rejected" | "cancelled";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await fetchVendorOrders());
      setError(null);
    } catch {
      setError("Could not load orders. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function decide(order: Order, status: "accepted" | "rejected") {
    setBusyId(order._id);
    try {
      const updated = await decideOrder(order._id, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status: updated.status } : o))
      );
      toast.success(`Order ${status}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update this order");
    } finally {
      setBusyId(null);
    }
  }

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeading
          title="Customer Orders"
          description="View, accept, and reject customer orders in real-time."
        />
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <Button
            size="sm"
            variant={viewMode === "table" ? "default" : "ghost"}
            className={viewMode === "table" ? "bg-[#c8402b] hover:bg-[#a83422] text-white h-8" : "h-8 text-muted-foreground"}
            onClick={() => setViewMode("table")}
          >
            <List className="mr-1.5 size-4" /> Table View
          </Button>
          <Button
            size="sm"
            variant={viewMode === "cards" ? "default" : "ghost"}
            className={viewMode === "cards" ? "bg-[#c8402b] hover:bg-[#a83422] text-white h-8" : "h-8 text-muted-foreground"}
            onClick={() => setViewMode("cards")}
          >
            <LayoutGrid className="mr-1.5 size-4" /> Cards View
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="flex-wrap">
          {(["all", "pending", "accepted", "rejected", "cancelled"] as Filter[]).map((f) => (
            <TabsTrigger key={f} value={f} className="capitalize">
              {f}
              {f !== "all"
                ? ` (${orders.filter((o) => o.status === f).length})`
                : ` (${orders.length})`}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Card className="border-dashed border-border bg-card">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No {filter === "all" ? "" : filter} orders yet.
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card className="overflow-hidden border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[240px]">Pizza Item</TableHead>
                  <TableHead className="w-[180px]">Customer</TableHead>
                  <TableHead className="w-[240px]">Delivery Details</TableHead>
                  <TableHead className="w-[160px]">Requested Date</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[160px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((order) => {
                  const item = typeof order.itemId === "object" ? order.itemId : null;
                  const customer =
                    typeof order.customerId === "object" ? (order.customerId as AppUser) : null;
                  const isBusy = busyId === order._id;

                  return (
                    <TableRow key={order._id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                            {item?.images?.[0] ? (
                              <Image
                                src={item.images[0]}
                                alt={item.itemName || "Pizza"}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <Pizza className="m-auto size-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-1 font-semibold text-foreground">
                              {item?.itemName ?? "Pizza Item"}{" "}
                              {order.quantity && order.quantity > 1 ? `(${order.quantity}x)` : ""}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <p className="text-xs font-bold text-[#c8402b]">
                                {formatPrice(order.totalAmount || (item?.price ?? 0) * (order.quantity || 1))}
                              </p>
                              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-800 dark:text-amber-400">
                                <Banknote className="size-3" /> COD
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="font-medium text-foreground">
                          {customer?.name ?? "Customer"}
                        </p>
                        {customer?.email ? (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="size-3 text-muted-foreground" />
                            {customer.email}
                          </p>
                        ) : null}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="flex items-start gap-1">
                            <MapPin className="mt-0.5 size-3.5 shrink-0 text-foreground" />
                            <span className="line-clamp-2 text-foreground font-medium">
                              {order.deliveryAddress}
                            </span>
                          </p>
                          <p className="flex items-center gap-1">
                            <CalendarDays className="size-3 shrink-0" />
                            <span>Delivery: {formatDate(order.deliveryDate)}</span>
                          </p>
                          {order.message ? (
                            <p className="flex items-start gap-1 rounded bg-muted/60 p-1 text-[11px] italic text-foreground">
                              <MessageSquare className="mt-0.5 size-3 shrink-0" />
                              <span className="line-clamp-1">{order.message}</span>
                            </p>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>

                      <TableCell className="text-right">
                        {order.status === "pending" ? (
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              size="sm"
                              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5"
                              disabled={isBusy}
                              onClick={() => void decide(order, "accepted")}
                            >
                              {isBusy ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Check className="size-3.5 mr-1" />
                              )}
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-red-500/30 text-red-600 hover:bg-red-500/10 px-2.5"
                              disabled={isBusy}
                              onClick={() => void decide(order, "rejected")}
                            >
                              <X className="size-3.5 mr-1" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground capitalize">
                            {order.status}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => {
            const item = typeof order.itemId === "object" ? order.itemId : null;
            const customer =
              typeof order.customerId === "object" ? (order.customerId as AppUser) : null;
            return (
              <Card key={order._id} className="border-border bg-card">
                <CardContent className="grid gap-5 p-5 lg:grid-cols-[auto_1.4fr_1fr_auto] lg:items-center">
                  <div className="relative size-20 overflow-hidden rounded-lg bg-muted dark:bg-stone-800">
                    {item?.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.itemName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-foreground">
                        {item?.itemName ?? "Menu item"}{" "}
                        {order.quantity && order.quantity > 1 ? `(${order.quantity}x)` : ""}
                      </h3>
                      <StatusBadge status={order.status} />
                      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-800 dark:text-amber-400">
                        <Banknote className="size-3" /> Cash on Delivery
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#c8402b]">
                      {formatPrice(order.totalAmount || (item?.price ?? 0) * (order.quantity || 1))}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5" /> Requested {formatDateTime(order.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-sm text-foreground">
                    <p className="flex items-center gap-2 font-medium">
                      {customer?.name ?? "Customer"}
                    </p>
                    {customer?.email ? (
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="size-3.5" /> {customer.email}
                      </p>
                    ) : null}
                    <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" /> {order.deliveryAddress}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" /> Delivery{" "}
                      {formatDate(order.deliveryDate)}
                    </p>
                    {order.message ? (
                      <p className="flex items-start gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1.5 text-xs text-foreground">
                        <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />{" "}
                        {order.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex gap-2 lg:flex-col">
                    {order.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          disabled={busyId === order._id}
                          onClick={() => void decide(order, "accepted")}
                        >
                          {busyId === order._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Check className="size-3.5" />
                          )}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10 dark:text-red-400"
                          disabled={busyId === order._id}
                          onClick={() => void decide(order, "rejected")}
                        >
                          <X className="size-3.5" /> Reject
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground capitalize">
                        {order.status}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const map = {
    pending: "warning",
    accepted: "success",
    rejected: "destructive",
    cancelled: "muted",
  } as const;
  return (
    <Badge variant={map[status]} className="capitalize">
      {status}
    </Badge>
  );
}
