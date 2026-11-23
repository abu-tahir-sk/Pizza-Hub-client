"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowDownUp,
  Pizza,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
} from "lucide-react";
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

  const urlSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
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
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== search) {
      setSearch(q);
      setDebouncedSearch(q);
      setPage(1);
    }
  }, [searchParams]);

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
      {/* Compact Advertisement Billboard Banner */}
      <section className="relative mx-auto max-w-7xl px-4 pt-4 sm:pt-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="group relative min-h-[150px] sm:min-h-[175px] lg:min-h-[200px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 shadow-lg flex items-center"
        >
          {/* Background Pizza Image */}
          <Image
            src="/images/menu-banner-pizza.jpg"
            alt="Fresh, Hot & Wood-Fired Pizza Deal"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Lighting & Darkness Overlay for high contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 sm:to-transparent" />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Ad Content Container */}
          <div className="relative z-10 flex flex-col justify-center px-5 py-4 sm:px-8 sm:py-6 lg:px-12 max-w-2xl text-white">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#f43f5e] mb-1">
              <Sparkles className="size-3.5" />
              <span>Today Best Deal</span>
            </span>

            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Fresh, Hot &amp; Wood-Fired
              <br />
              <span className="text-[#fbbf24] drop-shadow-sm">
                Get 20% OFF Today!
              </span>
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-neutral-300 font-normal line-clamp-1">
              Use code <span className="font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">PIZZA20</span> at checkout on all handcrafted artisan pizzas.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-[1.6fr_1fr_1fr_1fr]"
        >
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
        </motion.div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-[#f0a23c]" />
            {loading ? "Loading menu…" : `${total} item${total === 1 ? "" : "s"} found`}
          </p>
          {(search || location || category !== "All") && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[#f43f5e] hover:text-[#e11d48] flex items-center gap-1.5 font-semibold"
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
            <Button onClick={() => void load()} className="mt-4 bg-[#f43f5e] hover:bg-[#e11d48]">
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-14 text-center">
            <Pizza className="mx-auto mb-3 size-11 text-[#f43f5e]" />
            <h2 className="text-lg font-bold text-foreground">No pizzas match your search</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different keyword, category, or location.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
              const col = index % 3;
              const xOffset = col === 0 ? -45 : col === 2 ? 45 : 0;
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: xOffset, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MenuItemCard item={item} index={index} />
                </motion.div>
              );
            })}
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
