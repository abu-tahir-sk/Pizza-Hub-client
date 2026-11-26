"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  MessageSquare,
  Pizza,
  Store,
  XCircle,
} from "lucide-react";
import type { Order } from "@/types";
import type { VendorInfo } from "@/lib/types";
import { cancelOrder, fetchCustomerOrders, ApiError } from "@/lib/api";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDateTime, formatPrice, cn } from "@/lib/utils";

type Filter = "all" | "pending" | "accepted" | "rejected" | "cancelled";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await fetchCustomerOrders());
      setError(null);
    } catch {
      setError("Could not load your orders. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCancel(order: Order) {
    setBusyId(order._id);
    try {
      const updated = await cancelOrder(order._id);
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status: updated.status } : o)));
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not cancel this order");
    } finally {
      setBusyId(null);
    }
  }

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <PageHeading
        title="My Orders"
        description="Track your orders and cancel while they are still pending."
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="flex-wrap">
          {(["all", "pending", "accepted", "rejected", "cancelled"] as Filter[]).map((f) => (
            <TabsTrigger key={f} value={f} className="capitalize">
              {f}
              {f !== "all" ? ` (${orders.filter((o) => o.status === f).length})` : ` (${orders.length})`}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {error ? (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => void load()} className="border-red-300 hover:bg-red-100 dark:hover:bg-red-900/40">
            Retry
          </Button>
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Card className="border-dashed border-border bg-card">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No {filter === "all" ? "" : filter} orders yet. Browse the menu to place your first
            order.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => {
            const item = typeof order.itemId === "object" ? order.itemId : null;
            const vendor = typeof order.vendorId === "object" ? (order.vendorId as VendorInfo) : null;
            return (
              <Card key={order._id} className="border-border bg-card">
                <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-muted dark:bg-stone-800 sm:h-20 sm:w-28">
                    {item?.images?.[0] ? (
                      <Image src={item.images[0]} alt={item.itemName} fill sizes="112px" className="object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-foreground">
                        {item?.itemName ?? "Menu item"}{" "}
                        {order.quantity && order.quantity > 1 ? `(${order.quantity}x)` : ""}
                      </h3>
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
                      <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400 gap-1 text-[11px] font-semibold"
                      >
                        <Banknote className="size-3" />
                        Cash on Delivery
                      </Badge>
                    </div>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Store className="size-3.5" />
                      {vendor?.businessName || vendor?.name || "PizzaHub vendor"}
                    </p>
                    <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" /> {order.deliveryAddress}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" /> Delivery {formatDate(order.deliveryDate)} ·
                      requested {formatDateTime(order.createdAt)}
                    </p>
                    {order.message ? (
                      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MessageSquare className="mt-0.5 size-3.5 shrink-0" /> {order.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                    <span className="text-lg font-extrabold text-[#f43f5e]">
                      {formatPrice(order.totalAmount || (item?.price ?? 0) * (order.quantity || 1))}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedOrder(order)}
                        className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                      >
                        <Eye className="size-3.5" />
                        View Details
                      </Button>
                      {order.status === "pending" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-red-500/30 text-red-600 hover:bg-red-500/10 dark:text-red-400 gap-1.5 text-xs cursor-pointer"
                          disabled={busyId === order._id}
                          onClick={() => void handleCancel(order)}
                        >
                          <XCircle className="size-3.5" />
                          {busyId === order._id ? "Cancelling…" : "Cancel order"}
                        </Button>
                      ) : null}
                    </div>
                    {order.status !== "pending" && <OrderTimeline status={order.status} />}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Details Dialog (Requirement 7.2) */}
      <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        {selectedOrder && (() => {
          const detItem = typeof selectedOrder.itemId === "object" ? selectedOrder.itemId : null;
          const detVendor =
            typeof selectedOrder.vendorId === "object" ? (selectedOrder.vendorId as VendorInfo) : null;
          const isPending = selectedOrder.status === "pending";

          return (
            <DialogContent className="max-w-lg border-border bg-card text-foreground">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-extrabold">Order Details</DialogTitle>
                  <Badge
                    variant={
                      selectedOrder.status === "accepted"
                        ? "success"
                        : selectedOrder.status === "pending"
                          ? "warning"
                          : selectedOrder.status === "rejected"
                            ? "destructive"
                            : "muted"
                    }
                    className="capitalize font-bold"
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  Order ID: <span className="font-mono">{selectedOrder._id}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Item and image */}
                <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {detItem?.images?.[0] ? (
                      <Image
                        src={detItem.images[0]}
                        alt={detItem.itemName || "Item"}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <Pizza className="m-auto size-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-foreground text-base">
                      {detItem?.itemName || "Menu item"}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Quantity: <span className="font-bold text-foreground">{selectedOrder.quantity || 1}</span>
                    </p>
                    <p className="text-sm font-extrabold text-[#f43f5e] mt-0.5">
                      {formatPrice(selectedOrder.totalAmount ?? (detItem?.price ?? 0) * (selectedOrder.quantity || 1))}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1 rounded-lg border border-border p-2.5 bg-card">
                    <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <Store className="size-3.5 text-[#f43f5e]" /> Restaurant / Vendor
                    </span>
                    <p className="font-bold text-foreground">
                      {detVendor?.businessName || detVendor?.name || "PizzaHub Vendor"}
                    </p>
                  </div>

                  <div className="space-y-1 rounded-lg border border-border p-2.5 bg-card">
                    <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <Banknote className="size-3.5 text-amber-500" /> Payment Method
                    </span>
                    <p className="font-bold text-foreground">Cash on Delivery (Unpaid)</p>
                  </div>

                  <div className="space-y-1 rounded-lg border border-border p-2.5 bg-card">
                    <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <CalendarDays className="size-3.5 text-blue-500" /> Delivery Date
                    </span>
                    <p className="font-bold text-foreground">{formatDate(selectedOrder.deliveryDate)}</p>
                  </div>

                  <div className="space-y-1 rounded-lg border border-border p-2.5 bg-card">
                    <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <Clock className="size-3.5 text-purple-500" /> Request Date
                    </span>
                    <p className="font-bold text-foreground">{formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1 rounded-lg border border-border p-3 bg-card text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                    <MapPin className="size-3.5 text-emerald-500" /> Delivery Address
                  </span>
                  <p className="text-foreground font-medium leading-relaxed">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>

                {/* Special Instructions */}
                {selectedOrder.message ? (
                  <div className="space-y-1 rounded-lg border border-border p-3 bg-card text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <MessageSquare className="size-3.5 text-orange-500" /> Additional Message / Special Instructions
                    </span>
                    <p className="italic text-foreground leading-relaxed">
                      "{selectedOrder.message}"
                    </p>
                  </div>
                ) : null}
              </div>

              <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
                {isPending ? (
                  <Button
                    variant="outline"
                    className="border-red-500/30 text-red-600 hover:bg-red-500/10 dark:text-red-400 gap-1.5 text-xs"
                    disabled={busyId === selectedOrder._id}
                    onClick={async () => {
                      await handleCancel(selectedOrder);
                      setSelectedOrder(null);
                    }}
                  >
                    <XCircle className="size-4" />
                    {busyId === selectedOrder._id ? "Cancelling…" : "Cancel this order"}
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    This order is {selectedOrder.status} and cannot be modified.
                  </p>
                )}
                <Button variant="secondary" onClick={() => setSelectedOrder(null)} className="text-xs">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          );
        })()}
      </Dialog>
    </div>
  );
}

/** Simple visual status timeline (optional requirement). */
function OrderTimeline({ status }: { status: Order["status"] }) {
  const steps = ["pending", "accepted", "delivered"] as const;
  const reached =
    status === "accepted"
      ? 1
      : status === "rejected"
        ? 1
        : status === "cancelled"
          ? 0
          : 0;
  const failed = status === "rejected" || status === "cancelled";

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      {steps.map((step, index) => (
        <span key={step} className="flex items-center gap-1.5">
          <span
            className={cn(
              "grid size-4 place-items-center rounded-full",
              index <= reached && !failed
                ? "bg-emerald-100 text-emerald-700"
                : failed
                  ? "bg-red-100 text-red-600"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {index === 0 ? (
              <Clock className="size-2.5" />
            ) : failed ? (
              <XCircle className="size-2.5" />
            ) : (
              <CheckCircle2 className="size-2.5" />
            )}
          </span>
          <span className="capitalize">{step}</span>
          {index < steps.length - 1 ? <span className="text-[#e3cdb6]">—</span> : null}
        </span>
      ))}
    </div>
  );
}
