"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowDownUp,
  Clock,
  Flame,
  Pizza,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
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
      {/* Page header & Featured Promo Banner */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/60 via-muted/30 to-background py-10 lg:py-14 text-foreground transition-colors">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 items-center lg:grid-cols-12">
            {/* Left Column: Heading, description & value props */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c8402b] dark:text-[#f0a23c]">
                <Flame className="size-3.5 text-orange-500" />
                Freshly Baked Near You
              </div>

              <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                Browse Our Artisan Menu
              </h1>

              <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Explore hand-crafted sourdough pizzas, slow-simmered sauces, and fresh gourmet sides baked to golden perfection daily.
              </p>

              {/* Value proposition badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-medium">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-2 text-foreground shadow-xs">
                  <Clock className="size-4 text-orange-500" />
                  <span>30-Min Fast Delivery</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-2 text-foreground shadow-xs">
                  <Pizza className="size-4 text-orange-500" />
                  <span>100% Wood-Fired Crust</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-2 text-foreground shadow-xs">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span>Verified Artisan Chefs</span>
                </div>
              </div>

              {/* Promo announcement banner */}
              <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/5 px-4 py-2.5 text-xs sm:text-sm text-foreground">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  %
                </span>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Today&apos;s Special:</strong> Get{" "}
                  <span className="font-semibold text-orange-600 dark:text-orange-400">20% OFF</span> on orders above $30 with code{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-bold text-foreground">PIZZA20</code>
                </p>
              </div>
            </motion.div>

            {/* Right Column: Visual Promotional Ad Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/50 p-2.5 sm:p-3 shadow-xl shadow-orange-500/5 transition-all hover:border-orange-500/40 hover:shadow-orange-500/10">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src="/images/menu-banner-pizza.jpg"
                    alt="Artisan Wood-Fired Specialty Pizza"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 480px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient shadow for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Top floating promo badge */}
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-orange-600/95 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    <Sparkles className="size-3.5" />
                    Special Deal · 20% Off
                  </div>

                  {/* Rating pill */}
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/65 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 (1.4k+)</span>
                  </div>

                  {/* Bottom description overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                      Featured Sensation
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow-sm">
                      Truffle Burrata & Wood-Fired Margherita
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-white/80">
                      Slow-fermented artisan crust, San Marzano tomatoes, and fresh basil.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
