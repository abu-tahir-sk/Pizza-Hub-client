"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Pencil, PlusCircle, Trash2, UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "@/types";
import { MENU_CATEGORIES } from "@/lib/types";
import { deleteMenuItem, fetchVendorMenuItems, updateMenuItem, ApiError } from "@/lib/api";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";

export default function VendorItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState<MenuItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchVendorMenuItems());
      setError(null);
    } catch {
      setError("Could not load your menu items. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleAvailability(item: MenuItem, active: boolean) {
    setBusyId(item._id);
    try {
      const updated = await updateMenuItem(item._id, { status: active ? "active" : "inactive" });
      setItems((prev) => prev.map((i) => (i._id === item._id ? updated : i)));
      toast.success(active ? "Item is now available" : "Item hidden from customers");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update availability");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusyId(deleting._id);
    try {
      await deleteMenuItem(deleting._id);
      setItems((prev) => prev.filter((i) => i._id !== deleting._id));
      toast.success("Menu item deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete this item");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const updated = await updateMenuItem(editing._id, {
        itemName: String(form.get("itemName") ?? ""),
        category: String(form.get("category") ?? editing.category) as MenuItem["category"],
        description: String(form.get("description") ?? ""),
        price: Number(form.get("price") ?? 0),
        location: String(form.get("location") ?? ""),
      });
      setItems((prev) => prev.map((i) => (i._id === editing._id ? updated : i)));
      toast.success("Menu item updated — changes will be reviewed if required");
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update this item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="My Menu Items"
        description="Manage your dishes, availability, and approval status."
        action={
          <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521]">
            <Link href="/dashboard/vendor/items/new">
              <PlusCircle className="size-4" /> Add Item
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-border bg-card">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <UtensilsCrossed className="size-10 text-[#c8402b]" />
            <h2 className="text-lg font-bold text-foreground">No menu items yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add your first pizza — it stays pending until an admin approves it.
            </p>
            <Button asChild className="mt-2 bg-[#c8402b] hover:bg-[#ad3521]">
              <Link href="/dashboard/vendor/items/new">Add your first item</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden border-border bg-card">
              <div className="relative h-44 w-full bg-muted dark:bg-stone-800">
                <Image
                  src={item.images[0]}
                  alt={item.itemName}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute left-3 top-3">
                  <StatusBadge status={item.status} />
                </div>
              </div>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 font-bold text-foreground">{item.itemName}</h3>
                  <span className="shrink-0 font-extrabold text-[#c8402b]">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.category} · {item.location}
                </p>
                {item.status === "rejected" && item.rejectionReason ? (
                  <p className="rounded-md bg-red-500/10 px-2 py-1.5 text-xs text-red-600 dark:text-red-400">
                    Rejected: {item.rejectionReason}
                  </p>
                ) : null}

                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <span className="text-xs font-semibold text-foreground">
                    Available to order
                  </span>
                  <Switch
                    checked={item.status === "approved"}
                    disabled={
                      busyId === item._id ||
                      item.status === "pending" ||
                      item.status === "rejected"
                    }
                    onCheckedChange={(checked) => void toggleAvailability(item, checked)}
                    aria-label="Toggle availability"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditing(item)}
                    disabled={item.status === "pending"}
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10 dark:text-red-400"
                    onClick={() => setDeleting(item)}
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit menu item</DialogTitle>
            <DialogDescription>
              Update the details below. Approval status is controlled by the admin.
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Item name</Label>
                <Input id="edit-name" name="itemName" defaultValue={editing.itemName} required minLength={2} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select name="category" defaultValue={editing.category}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MENU_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea id="edit-desc" name="description" defaultValue={editing.description} required minLength={10} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price">Price (USD)</Label>
                  <Input id="edit-price" name="price" type="number" step="0.01" min="0" defaultValue={editing.price} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input id="edit-location" name="location" defaultValue={editing.location} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-[#c8402b] hover:bg-[#ad3521]">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{deleting?.itemName}”?</DialogTitle>
            <DialogDescription>
              This permanently removes the item from your menu. Pending orders for it will be
              cancelled. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={busyId === deleting?._id}
            >
              {busyId === deleting?._id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: MenuItem["status"] }) {
  const map = {
    pending: { variant: "warning", label: "Pending review" },
    approved: { variant: "success", label: "Approved" },
    rejected: { variant: "destructive", label: "Rejected" },
    inactive: { variant: "muted", label: "Inactive" },
  } as const;
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
