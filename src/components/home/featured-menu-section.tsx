"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChefHat, MapPin, Star } from "lucide-react";
import type { MenuItem } from "@/types";
import { fetchFeaturedMenu, fetchMenuItems } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const getCardMotion = (index: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: {
    duration: 0.4,
    delay: (index % 4) * 0.06,
    ease: [0.22, 1, 0.36, 1] as const,
  },
});

const BADGES = ["BEST SELLER", "TOP RATED", "NEW", "CHEF'S PICK"];

function vendorName(item: MenuItem): string {
  if (typeof item.vendorId === "object" && item.vendorId) {
    return item.vendorId.businessName || item.vendorId.name || "Local kitchen";
  }
  return "Local kitchen";
}

function badgeFor(item: MenuItem, index: number): string {
  if (typeof item.vendorId === "object" && item.vendorId?.subscriptionPlan === "premium") {
    return "PREMIUM";
  }
  return BADGES[index % BADGES.length];
}

const FEATURED_LIMIT = 8;

export function FeaturedMenuSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const featured = await fetchFeaturedMenu();
      let list = featured;

      // Featured placement is a premium benefit — make sure the homepage still
      // shows a full grid when there are fewer than eight premium items.
      if (list.length < FEATURED_LIMIT) {
        const latest = await fetchMenuItems({ limit: FEATURED_LIMIT * 2 });
        const seen = new Set(list.map((item) => item._id));
        for (const item of latest.items) {
          if (list.length >= FEATURED_LIMIT) break;
          if (!seen.has(item._id)) {
            seen.add(item._id);
            list = [...list, item];
          }
        }
      }

      setItems(list.slice(0, FEATURED_LIMIT));
    } catch {
      setError("We couldn't load the popular pizzas right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="border-t border-border bg-muted/30 py-16 transition-colors sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d4432d]">
              Trending on PizzaHub
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Popular Right Now
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Handpicked favourites that everyone&apos;s asking for, straight from approved local menus.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#d4432d] transition-colors hover:text-[#b83320]"
          >
            View all menu
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-border bg-card p-2.5">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <p className="font-medium text-red-700 dark:text-red-400">{error}</p>
            <Button
              onClick={() => void load()}
              className="mt-4 cursor-pointer bg-[#d4432d] text-white hover:bg-[#b83320]"
            >
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <ChefHat className="mx-auto mb-3 size-12 text-[#d4432d]" />
            <h3 className="text-lg font-bold text-foreground">No pizzas available right now</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Our kitchens are restocking. Please check back in a few minutes.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <motion.div key={item._id} {...getCardMotion(index)} className="h-full">
                <Link
                  href={`/menu/${item._id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d4432d]/40 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item.images?.[0] || "/images/auth-pizza.jpg"}
                      alt={item.itemName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
                      {badgeFor(item, index)}
                    </span>
                    {typeof item.rating === "number" && item.rating > 0 ? (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-neutral-900 shadow-sm">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
                    <h3 className="line-clamp-1 text-sm font-bold text-foreground">
                      {item.itemName}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                      {vendorName(item)}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <span className="text-sm font-black text-[#d4432d]">
                        ${Number(item.price).toFixed(2)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="size-3 shrink-0" />
                        <span className="line-clamp-1">{item.location}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
