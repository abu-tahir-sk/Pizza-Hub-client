"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Ban,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Pizza,
  Search,
  Store,
  User as UserIcon,
  X,
  XCircle,
} from "lucide-react";
import type { Order, OrderStatus, MenuItem, User } from "@/types";
import { fetchAdminOrders, setAdminOrderStatus, ApiError } from "@/lib/api";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";

const PAGE_SIZE = 10;
type StatusFilter = "all" | OrderStatus;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminOrders({
        search: debounced || undefined,
        status: status === "all" ? undefined : status,
        page,
        limit: PAGE_SIZE,
      });
      setOrders(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setError(null);
    } catch {
      setError("Could not load orders. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [debounced, status, page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
    setBusyId(orderId);
    try {
      const updated = await setAdminOrderStatus(orderId, nextStatus);
      setOrders((prev) =>
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

  return (
    <div className="space-y-6">
      <PageHeading
        title="Manage Customer Orders"
        description="View and control all customer pizza orders across all restaurants and update their live fulfillment status."
      />

      <Tabs
        value={status}
        onValueChange={(v) => {
          setStatus(v as StatusFilter);
          setPage(1);
        }}
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, restaurant, pizza, or address…"
            className="h-11 pl-9"
            aria-label="Search orders"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading orders…" : `${total} order${total === 1 ? "" : "s"} found`}
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <Card className="overflow-hidden border-border bg-card">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            <Pizza className="mx-auto mb-2 size-10 text-muted-foreground/60" />
            No {status === "all" ? "" : status} orders match your search criteria.
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[240px]">Pizza Item</TableHead>
                  <TableHead className="w-[180px]">Customer</TableHead>
                  <TableHead className="w-[180px]">Restaurant / Vendor</TableHead>
                  <TableHead className="w-[220px]">Delivery Details</TableHead>
                  <TableHead className="w-[150px]">Order Date</TableHead>
                  <TableHead className="w-[130px]">Status</TableHead>
                  <TableHead className="w-[180px] text-right">Change Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const item =
                    typeof order.itemId === "object" ? (order.itemId as MenuItem) : null;
                  const customer =
                    typeof order.customerId === "object" ? (order.customerId as User) : null;
                  const vendor =
                    typeof order.vendorId === "object" ? (order.vendorId as User) : null;

                  const isUpdating = busyId === order._id;

                  return (
                    <TableRow key={order._id} className="hover:bg-muted/30">
                      {/* Pizza Item */}
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
                              {item?.itemName ?? "Pizza Item"}
                            </p>
                            <p className="text-xs font-bold text-[#f43f5e]">
                              {formatPrice(item?.price ?? 0)}
                            </p>
                            {item?.category ? (
                              <span className="text-[11px] text-muted-foreground">
                                {item.category}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1.5 font-medium text-foreground">
                            <UserIcon className="size-3.5 text-muted-foreground" />
                            {customer?.name ?? "Customer"}
                          </p>
                          {customer?.email ? (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="size-3 text-muted-foreground" />
                              {customer.email}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>

                      {/* Restaurant / Vendor */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1.5 font-medium text-foreground">
                            <Store className="size-3.5 text-[#f0a23c]" />
                            {vendor?.businessName || vendor?.name || "PizzaHub Official"}
                          </p>
                          {vendor?.email ? (
                            <p className="text-xs text-muted-foreground">
                              {vendor.email}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>

                      {/* Delivery Details */}
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

                      {/* Order Date */}
                      <TableCell>
                        <div className="space-y-0.5 text-xs text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>

                      {/* Change Status Action */}
                      <TableCell className="text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {isUpdating ? (
                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Select
                              value={order.status}
                              onValueChange={(val) =>
                                void handleStatusChange(order._id, val as OrderStatus)
                              }
                            >
                              <SelectTrigger className="h-8 w-32 text-xs font-semibold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent align="end">
                                <SelectItem value="pending" className="text-amber-600 font-medium">
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="size-3.5" />
                                    <span>Pending</span>
                                  </span>
                                </SelectItem>
                                <SelectItem value="accepted" className="text-emerald-600 font-medium">
                                  <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="size-3.5" />
                                    <span>Accepted</span>
                                  </span>
                                </SelectItem>
                                <SelectItem value="rejected" className="text-red-600 font-medium">
                                  <span className="flex items-center gap-1.5">
                                    <XCircle className="size-3.5" />
                                    <span>Rejected</span>
                                  </span>
                                </SelectItem>
                                <SelectItem value="cancelled" className="text-stone-500 font-medium">
                                  <span className="flex items-center gap-1.5">
                                    <Ban className="size-3.5" />
                                    <span>Cancelled</span>
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {!loading && totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="px-3 text-sm font-medium text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
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
