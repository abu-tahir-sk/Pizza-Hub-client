"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChefHat, Crown, Sparkles, Store } from "lucide-react";
import type { MenuItem } from "@/types";
import { fetchFeaturedMenu, fetchMenuItems } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const getCardMotion = (index: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.1 },
  transition: {
    duration: 0.4,
    delay: (index % 4) * 0.06,
    ease: [0.22, 1, 0.36, 1] as const,
  },
});

function vendorName(item: MenuItem): string {
  if (typeof item.vendorId === "object" && item.vendorId) {
    return item.vendorId.businessName || item.vendorId.name || "Local kitchen";
  }
  return "Local kitchen";
}

function isPremium(item: MenuItem): boolean {
  return typeof item.vendorId === "object" && item.vendorId?.subscriptionPlan === "premium";
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
    <section className="bg-background py-14 sm:py-20 border-t border-border text-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          {...fadeUp}
          className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]">
              FRESH FROM THE OVEN
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Popular Right Now
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground">
              Live dishes from approved vendor menus, with Premium kitchens placed first.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f43f5e] transition-colors hover:text-[#fb7185]"
          >
            Browse everything
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="space-y-3 rounded-2xl border border-border bg-card p-3"
              >
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-8 text-center">
            <p className="font-medium text-red-400">{error}</p>
            <Button
              onClick={() => void load()}
              className="mt-4 cursor-pointer bg-[#f43f5e] text-white hover:bg-[#e11d48]"
            >
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <ChefHat className="mx-auto mb-3 size-12 text-[#f59e0b]" />
            <h3 className="text-lg font-bold text-foreground">No pizzas available right now</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Our kitchens are restocking. Please check back in a few minutes.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => {
              const premium = isPremium(item);
              return (
                <motion.div key={item._id} {...getCardMotion(index)} className="h-full">
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-2xl">
                    {/* Top Badges & Food Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={item.images?.[0] || "/images/auth-pizza.jpg"}
                        alt={item.itemName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                        {premium ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-neutral-950 backdrop-blur-sm shadow-md">
                            <Crown className="size-2.5" />
                            PREMIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                            <Sparkles className="size-2.5 text-amber-400" />
                            POPULAR
                          </span>
                        )}
                        <span className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                          {item.category || "Pizza"}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col pt-3 px-1 pb-1">
                      {/* Pizza Name */}
                      <h3 className="line-clamp-1 text-sm font-bold text-foreground group-hover:text-[#f59e0b] transition-colors">
                        {item.itemName}
                      </h3>

                      {/* Description */}
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {item.description || "Handcrafted artisan pizza with freshly melted mozzarella and secret tomato sauce."}
                      </p>

                      {/* Vendor & Location info */}
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 truncate max-w-[60%]">
                          <Store className="size-3 text-[#f59e0b] shrink-0" />
                          <span className="truncate">{vendorName(item)}</span>
                        </span>
                        <span className="truncate text-[11px]">{item.location || "Local"}</span>
                      </div>

                      {/* Price & View Details button */}
                      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                        <span className="text-base font-bold text-[#f43f5e]">
                          ${Number(item.price).toFixed(2)}
                        </span>
                        <Link
                          href={`/menu/${item._id}`}
                          className="inline-flex items-center gap-1 rounded-full bg-[#f43f5e] px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-[#e11d48]"
                        >
                          View Details
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
