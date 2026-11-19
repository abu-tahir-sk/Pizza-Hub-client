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
import { CreditCard, DollarSign, Store, Users, UtensilsCrossed } from "lucide-react";
import { fetchAdminOverview, type AdminOverview } from "@/lib/api";
import { PageHeading, StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const overview = await fetchAdminOverview();
        if (!cancelled) setData(overview);
      } catch {
        if (!cancelled) setError("Could not load platform statistics. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const userChart = [
    { name: "Customers", count: data?.customers ?? 0, fill: "#c8402b" },
    { name: "Vendors", count: data?.vendors ?? 0, fill: "#f0a23c" },
  ];
  const contentChart = [
    { name: "Menu items", count: data?.totalMenuItems ?? 0, fill: "#0ea5e9" },
    { name: "Pending review", count: data?.pendingMenuItems ?? 0, fill: "#f59e0b" },
    { name: "Paid transactions", count: data?.totalTransactions ?? 0, fill: "#10b981" },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Platform Overview"
        description="Monitor users, menu moderation, and subscription revenue."
        action={
          <Button asChild variant="outline" className="border-[#d9b99e]">
            <Link href="/dashboard/admin/items">Review pending items</Link>
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Total Users" value={data?.totalUsers ?? 0} icon={Users} />
          <StatCard label="Vendors" value={data?.vendors ?? 0} icon={Store} tone="warning" />
          <StatCard label="Customers" value={data?.customers ?? 0} icon={Users} tone="info" />
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
