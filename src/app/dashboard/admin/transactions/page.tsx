"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Lock, ReceiptText } from "lucide-react";
import type { Transaction } from "@/types";
import { fetchAdminTransactions } from "@/lib/api";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatPrice } from "@/lib/utils";

const PAGE_SIZE = 10;
type StatusFilter = "all" | Transaction["status"];

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminTransactions({
        status: status === "all" ? "all" : status,
        page,
        limit: PAGE_SIZE,
      });
      setTransactions(res.transactions);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setTotalRevenue(res.totalRevenue);
      setError(null);
    } catch {
      setError("Could not load transactions. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeading
        title="Transactions"
        description="Read-only payment records. Premium is activated exclusively by the verified Stripe webhook."
        action={
          <Button asChild variant="outline" className="border-[#d9b99e]">
            <Link href="/dashboard/admin">Back to overview</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#efe1d0] sm:col-span-1">
          <CardContent className="flex items-center gap-3 p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <ReceiptText className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Total revenue
              </p>
              <p className="text-2xl font-extrabold text-[#3b1c12]">{formatPrice(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#efe1d0] sm:col-span-2">
          <CardContent className="flex items-start gap-3 p-5 text-xs leading-relaxed text-muted-foreground">
            <Lock className="mt-0.5 size-4 shrink-0 text-[#c8402b]" />
            <p>
              This ledger is immutable by design. Admins can view payments but there is deliberately
              no endpoint to edit a transaction or mark a failed payment as paid. Only the Stripe
              webhook can transition a payment to <strong>paid</strong>.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={status}
        onValueChange={(v) => {
          setStatus(v as StatusFilter);
          setPage(1);
        }}
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
      </Tabs>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Card className="border-[#efe1d0]">
        <CardHeader className="flex flex-row items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">
            {loading ? "Loading transactions…" : `${total} transaction${total === 1 ? "" : "s"}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <ReceiptText className="size-9 text-[#c8402b]" />
              <p className="font-semibold text-[#3b1c12]">No transactions yet</p>
              <p className="text-sm text-muted-foreground">
                Vendor subscription payments will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stripe session</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const vendor = typeof tx.vendorId === "object" ? tx.vendorId : null;
                  return (
                    <TableRow key={tx._id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatDateTime(tx.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        <p className="font-medium text-[#3b1c12]">
                          {vendor?.businessName || vendor?.name || "Vendor"}
                        </p>
                        {vendor?.email ? (
                          <p className="text-xs text-muted-foreground">{vendor.email}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm capitalize">{tx.plan}</TableCell>
                      <TableCell className="text-sm font-semibold">
                        {formatPrice(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <TransactionStatus status={tx.status} />
                      </TableCell>
                      <TableCell className="max-w-40 truncate font-mono text-[11px] text-muted-foreground">
                        {tx.stripeSessionId}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}

function TransactionStatus({ status }: { status: Transaction["status"] }) {
  const map = {
    paid: { variant: "success", label: "Paid" },
    pending: { variant: "warning", label: "Pending" },
    failed: { variant: "destructive", label: "Failed" },
    expired: { variant: "muted", label: "Expired" },
  } as const;
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
