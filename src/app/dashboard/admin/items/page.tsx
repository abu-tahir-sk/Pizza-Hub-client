"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Check,
  LayoutGrid,
  LayoutList,
  Loader2,
  Plus,
  Search,
  Store,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import type { MenuItem, MenuItemStatus } from "@/types";
import { MENU_CATEGORIES } from "@/lib/types";
import {
  deleteAdminMenuItem,
  fetchAdminMenuItems,
  setAdminMenuItemStatus,
  ApiError,
} from "@/lib/api";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate, formatPrice } from "@/lib/utils";

const PAGE_SIZE = 10;
type StatusFilter = "all" | MenuItemStatus;

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<MenuItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleting, setDeleting] = useState<MenuItem | null>(null);

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
      const res = await fetchAdminMenuItems({
        search: debounced || undefined,
        status: status === "all" ? "all" : status,
        category: category !== "all" ? category : undefined,
        page,
        limit: PAGE_SIZE,
      });
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setError(null);
    } catch {
      setError("Could not load menu items. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [debounced, status, category, page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(item: MenuItem, next: "approved" | "rejected" | "inactive") {
    setBusyId(item._id);
    try {
      const updated = await setAdminMenuItemStatus(
        item._id,
        next,
        next === "rejected" ? rejectReason.trim() || "Does not meet menu guidelines" : undefined
      );
      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id
            ? { ...i, status: updated.status, rejectionReason: updated.rejectionReason }
            : i
        )
      );
      toast.success(`Item ${next}`);
      setRejecting(null);
      setRejectReason("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update this item");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusyId(deleting._id);
    try {
      await deleteAdminMenuItem(deleting._id);
      setItems((prev) => prev.filter((i) => i._id !== deleting._id));
      setTotal((t) => Math.max(0, t - 1));
      toast.success("Menu item deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete this item");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Manage Menu Items"
        description="Approve or reject vendor submissions, remove inappropriate listings, or upload new pizzas directly."
        action={
          <Button asChild className="bg-[#f43f5e] hover:bg-[#a83422] text-white">
            <Link href="/dashboard/admin/items/new">
              <Plus className="size-4" /> Add New Pizza
            </Link>
          </Button>
        }
      />

      <Tabs
        value={status}
        onValueChange={(v) => {
          setStatus(v as StatusFilter);
          setPage(1);
        }}
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-[1fr_240px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search item name or description…"
            className="h-11 pl-9"
            aria-label="Search menu items"
          />
        </div>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-11" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {MENU_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading items…" : `${total} item${total === 1 ? "" : "s"} found`}
        </p>

        {/* View Mode Toggle: Table (default) vs Grid */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/50 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
              viewMode === "table"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Table view"
          >
            <LayoutList className="size-3.5" />
            <span>Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-3.5" />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-border bg-card">
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <UtensilsCrossed className="size-9 text-[#f43f5e]" />
            <p className="font-semibold text-foreground">No items match your filters</p>
            <p className="text-sm text-muted-foreground">Try another search or status.</p>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        /* ─── 1. TABLE VIEW (Default) ─── */
        <Card className="overflow-hidden border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[72px]">Image</TableHead>
                  <TableHead>Item Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Vendor & Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const vendor = typeof item.vendorId === "object" ? item.vendorId : null;
                  return (
                    <TableRow key={item._id} className="hover:bg-muted/30 transition-colors">
                      {/* Image */}
                      <TableCell className="py-3">
                        <div className="relative size-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/80">
                          {item.images?.[0] ? (
                            <Image
                              src={item.images[0]}
                              alt={item.itemName}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground">
                              <UtensilsCrossed className="size-5" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Item Details */}
                      <TableCell className="py-3">
                        <div className="max-w-xs space-y-0.5">
                          <p className="font-bold text-foreground text-sm line-clamp-1">{item.itemName}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                          {item.status === "rejected" && item.rejectionReason ? (
                            <p className="text-[11px] text-red-600 bg-red-50 dark:bg-red-950/40 rounded px-1.5 py-0.5 mt-1 inline-block">
                              Reason: {item.rejectionReason}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-3">
                        <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md whitespace-nowrap border border-border/40">
                          {item.category}
                        </span>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="py-3 font-black text-[#f43f5e] text-sm whitespace-nowrap">
                        {formatPrice(item.price)}
                      </TableCell>

                      {/* Vendor & Location */}
                      <TableCell className="py-3">
                        <div className="space-y-0.5 max-w-[200px]">
                          <p className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
                            <Store className="size-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate">{vendor?.businessName || vendor?.name || "Vendor"}</span>
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{item.location}</p>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3">
                        <StatusBadge status={item.status} />
                      </TableCell>

                      {/* Submitted Date */}
                      <TableCell className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== "approved" ? (
                            <Button
                              size="sm"
                              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-2.5"
                              disabled={busyId === item._id}
                              onClick={() => void updateStatus(item, "approved")}
                            >
                              {busyId === item._id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Check className="size-3.5 mr-1" />
                              )}
                              Approve
                            </Button>
                          ) : null}

                          {item.status !== "rejected" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-amber-200 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs px-2.5"
                              disabled={busyId === item._id}
                              onClick={() => {
                                setRejecting(item);
                                setRejectReason("");
                              }}
                            >
                              <X className="size-3.5 mr-1" /> Reject
                            </Button>
                          ) : null}

                          <Button
                            size="icon"
                            variant="outline"
                            className="size-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
                            disabled={busyId === item._id}
                            onClick={() => setDeleting(item)}
                            aria-label={`Delete ${item.itemName}`}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        /* ─── 2. GRID VIEW (Cards) ─── */
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const vendor = typeof item.vendorId === "object" ? item.vendorId : null;
            return (
              <Card key={item._id} className="flex flex-col overflow-hidden border-border bg-card">
                <div className="relative h-40 w-full bg-muted dark:bg-stone-800">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.itemName}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute left-3 top-3">
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <CardContent className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-bold text-foreground">{item.itemName}</h3>
                    <span className="shrink-0 font-extrabold text-[#f43f5e]">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.category} · {item.location}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Store className="size-3.5" />
                    {vendor?.businessName || vendor?.name || "Vendor"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Submitted {formatDate(item.createdAt)}
                  </p>
                  {item.status === "rejected" && item.rejectionReason ? (
                    <p className="rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-700">
                      {item.rejectionReason}
                    </p>
                  ) : null}

                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {item.status !== "approved" ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        disabled={busyId === item._id}
                        onClick={() => void updateStatus(item, "approved")}
                      >
                        {busyId === item._id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                        Approve
                      </Button>
                    ) : null}
                    {item.status !== "rejected" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                        disabled={busyId === item._id}
                        onClick={() => {
                          setRejecting(item);
                          setRejectReason("");
                        }}
                      >
                        <X className="size-3.5" /> Reject
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={busyId === item._id}
                      onClick={() => setDeleting(item)}
                      aria-label={`Delete ${item.itemName}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
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

      {/* Reject dialog */}
      <Dialog open={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject “{rejecting?.itemName}”?</DialogTitle>
            <DialogDescription>
              The vendor will see this reason on their dashboard and can re-submit later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Missing clear photos, misleading description…"
              maxLength={300}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={busyId === rejecting?._id}
              onClick={() => rejecting && void updateStatus(rejecting, "rejected")}
            >
              {busyId === rejecting?._id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
              Reject item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{deleting?.itemName}”?</DialogTitle>
            <DialogDescription>
              This permanently removes the item from the platform. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={busyId === deleting?._id}
              onClick={handleDelete}
            >
              {busyId === deleting?._id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: MenuItemStatus }) {
  const map = {
    pending: { variant: "warning", label: "Pending" },
    approved: { variant: "success", label: "Approved" },
    rejected: { variant: "destructive", label: "Rejected" },
    inactive: { variant: "muted", label: "Inactive" },
  } as const;
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
