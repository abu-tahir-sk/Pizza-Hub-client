"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownUp, Pizza, RotateCcw, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import type { MenuItem } from "@/types";
import { MENU_CATEGORIES } from "@/lib/types";
import { fetchMenuItems } from "@/lib/api";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 9;

function MenuBrowser() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<MenuItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setCategory(searchParams.get("category") ?? "All");
  }, [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortBy, sortDir] =
        sort === "price-asc"
          ? (["price", "asc"] as const)
          : sort === "price-desc"
            ? (["price", "desc"] as const)
            : (["createdAt", "desc"] as const);

      const res = await fetchMenuItems({
        search: debouncedSearch || undefined,
        category: category !== "All" ? category : undefined,
        location: location || undefined,
        sortBy,
        sortDir,
        page,
        limit: PAGE_SIZE,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      setError("We couldn't load the menu. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, location, sort, page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Page header */}
      <section className="border-b border-border bg-muted/40 py-14 text-foreground transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b] dark:text-[#f0a23c]">
            Freshly baked near you
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">Browse Menu</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Search by name, filter by category or location, and sort by price to find your next
            favourite slice.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pizzas, sides, drinks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              <div className="flex items-center gap-2 truncate">
                <Pizza className="size-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="All categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All categories</SelectItem>
              {MENU_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Area / city"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
              className="h-11 pl-9"
              aria-label="Filter by location"
            />
          </div>

          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-11" aria-label="Sort items">
              <div className="flex items-center gap-2 truncate">
                <ArrowDownUp className="size-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Sort" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-[#f0a23c]" />
            {loading ? "Loading menu…" : `${total} item${total === 1 ? "" : "s"} found`}
          </p>
          {(search || location || category !== "All") && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[#c8402b] hover:text-[#ad3521] flex items-center gap-1.5 font-semibold"
              onClick={() => {
                setSearch("");
                setLocation("");
                setCategory("All");
                setPage(1);
              }}
            >
              <RotateCcw className="size-3.5" />
              Clear filters
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-border bg-card p-4">
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <p className="font-medium text-red-700 dark:text-red-400">{error}</p>
            <Button onClick={() => void load()} className="mt-4 bg-[#c8402b] hover:bg-[#ad3521]">
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-14 text-center">
            <Pizza className="mx-auto mb-3 size-11 text-[#c8402b]" />
            <h2 className="text-lg font-bold text-foreground">No pizzas match your search</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different keyword, category, or location.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="px-3 text-sm font-medium text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      }
    >
      <MenuBrowser />
    </Suspense>
  );
}
