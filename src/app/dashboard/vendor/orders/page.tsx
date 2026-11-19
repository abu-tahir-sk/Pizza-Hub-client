"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CalendarDays, Check, Clock, Loader2, Mail, MapPin, MessageSquare, Phone, X } from "lucide-react";
import type { Order } from "@/types";
import type { AppUser } from "@/lib/types";
import { decideOrder, fetchVendorOrders, ApiError } from "@/lib/api";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";

type Filter = "all" | "pending" | "accepted" | "rejected" | "cancelled";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

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
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status: updated.status } : o)));
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
      <PageHeading
        title="Customer Orders"
        description="Accept or reject pending orders. Each order can be decided only once."
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Card className="border-dashed border-[#e3cdb6]">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No {filter === "all" ? "" : filter} orders yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => {
            const item = typeof order.itemId === "object" ? order.itemId : null;
            const customer = typeof order.customerId === "object" ? (order.customerId as AppUser) : null;
            return (
              <Card key={order._id} className="border-[#efe1d0]">
                <CardContent className="grid gap-5 p-5 lg:grid-cols-[auto_1.4fr_1fr_auto] lg:items-center">
                  <div className="relative size-20 overflow-hidden rounded-lg bg-[#f7ecdf]">
                    {item?.images?.[0] ? (
                      <Image src={item.images[0]} alt={item.itemName} fill sizes="80px" className="object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-[#3b1c12]">{item?.itemName ?? "Menu item"}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm font-semibold text-[#c8402b]">
                      {formatPrice(item?.price ?? 0)}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5" /> Requested {formatDateTime(order.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-sm text-[#5d4032]">
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
                      <CalendarDays className="size-3.5" /> Delivery {formatDate(order.deliveryDate)}
                    </p>
                    {order.message ? (
                      <p className="flex items-start gap-1.5 rounded-md bg-[#fdf3e8] px-2 py-1.5 text-xs text-[#7a5c4d]">
                        <MessageSquare className="mt-0.5 size-3.5 shrink-0" /> {order.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex gap-2 lg:flex-col">
                    {order.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
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
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          disabled={busyId === order._id}
                          onClick={() => void decide(order, "rejected")}
                        >
                          <X className="size-3.5" /> Reject
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">No action needed</span>
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
  return <Badge variant={map[status]} className="capitalize">{status}</Badge>;
}
