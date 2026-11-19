"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Ban,
  CheckCircle2,
  Loader2,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import type { User } from "@/types";
import { fetchAdminUsers, setAdminUserBlockStatus, ApiError } from "@/lib/api";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [role, setRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
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
      const res = await fetchAdminUsers({
        search: debounced || undefined,
        role: role !== "all" ? role : undefined,
        page,
        limit: PAGE_SIZE,
      });
      setUsers(res.users);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setError(null);
    } catch {
      setError("Could not load users. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [debounced, role, page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleBlock(user: User, isBlocked: boolean) {
    const id = user._id ?? user.id;
    setBusyId(id);
    try {
      const updated = await setAdminUserBlockStatus(id, isBlocked);
      setUsers((prev) =>
        prev.map((u) => ((u._id ?? u.id) === id ? { ...u, isBlocked: updated.isBlocked } : u))
      );
      toast.success(isBlocked ? "User blocked" : "User unblocked");
      setPendingUser(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update this user");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Manage Users"
        description="Search accounts, review roles, and block abusive users. Admins can never be blocked."
      />

      <div className="grid gap-3 rounded-xl border border-[#efe1d0] bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a18573]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="h-11 pl-9"
            aria-label="Search users"
          />
        </div>
        <Select
          value={role}
          onValueChange={(v) => {
            setRole(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-11" aria-label="Filter by role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="vendor">Vendors</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-[#7a5c4d]">
        {loading ? "Loading users…" : `${total} user${total === 1 ? "" : "s"} found`}
      </p>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="border-dashed border-[#e3cdb6]">
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Users className="size-9 text-[#c8402b]" />
            <p className="font-semibold text-[#3b1c12]">No users match your filters</p>
            <p className="text-sm text-muted-foreground">Try a different search or role.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-[#efe1d0]">
          <div className="divide-y divide-[#f3e6d8]">
            {users.map((user) => {
              const id = user._id ?? user.id;
              return (
                <div
                  key={id}
                  className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap"
                >
                  <Avatar className="size-10">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-[#fdeade] text-[#c8402b]">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[#3b1c12]">{user.name}</p>
                      <RoleBadge role={user.role} />
                      {user.isBlocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Joined {user.createdAt ? formatDate(user.createdAt) : "—"}
                      {user.businessName ? ` · ${user.businessName}` : ""}
                    </p>
                  </div>

                  {user.role === "admin" ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <ShieldCheck className="size-3.5" /> Protected
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className={
                        user.isBlocked
                          ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          : "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      }
                      onClick={() => setPendingUser(user)}
                    >
                      {user.isBlocked ? (
                        <>
                          <CheckCircle2 className="size-3.5" /> Unblock
                        </>
                      ) : (
                        <>
                          <Ban className="size-3.5" /> Block
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {!loading && totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="px-3 text-sm font-medium text-[#7a5c4d]">
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

      <Dialog open={!!pendingUser} onOpenChange={(open) => !open && setPendingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingUser?.isBlocked ? "Unblock" : "Block"} “{pendingUser?.name}”?
            </DialogTitle>
            <DialogDescription>
              {pendingUser?.isBlocked
                ? "This user will regain access to sign in and use their dashboard."
                : "This user will be signed out and denied access to all protected APIs until unblocked."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingUser(null)}>
              Cancel
            </Button>
            <Button
              variant={pendingUser?.isBlocked ? "default" : "destructive"}
              disabled={busyId === (pendingUser?._id ?? pendingUser?.id)}
              onClick={() =>
                pendingUser && void toggleBlock(pendingUser, !pendingUser.isBlocked)
              }
            >
              {busyId === (pendingUser?._id ?? pendingUser?.id) ? (
                <Loader2 className="size-4 animate-spin" />
              ) : pendingUser?.isBlocked ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Ban className="size-4" />
              )}
              {pendingUser?.isBlocked ? "Unblock user" : "Block user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RoleBadge({ role }: { role: User["role"] }) {
  if (role === "admin") {
    return (
      <Badge variant="success">
        <ShieldCheck className="size-3" /> Admin
      </Badge>
    );
  }
  if (role === "vendor") {
    return (
      <Badge variant="warning">
        <Store className="size-3" /> Vendor
      </Badge>
    );
  }
  return (
    <Badge variant="muted">
      <UserRound className="size-3" /> Customer
    </Badge>
  );
}
