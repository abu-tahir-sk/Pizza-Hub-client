"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChefHat, Sparkles } from "lucide-react";
import type { MenuItem } from "@/types";
import { fetchFeaturedMenu } from "@/lib/api";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const get3ColSlide = (index: number) => {
  const col = index % 3;
  const x = col === 0 ? -30 : col === 2 ? 30 : 0;
  return {
    initial: { opacity: 0, x, y: 20, scale: 0.98 },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: {
      duration: 0.45,
      delay: (index % 3) * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
};

export function FeaturedMenuSection() {
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchFeaturedMenu();
        if (!cancelled) setFeatured(data);
      } catch {
        if (!cancelled) setError("Could not load featured items. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="border-t border-border bg-muted/20 py-20 sm:py-24 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Uniform Section Heading */}
        <motion.div {...fadeUp} className="mb-14 text-center space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4432d]">
            Chef&apos;s Specials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground">
            Featured Menu Items
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Handpicked active and approved specialties from verified top-rated local artisan kitchens.
          </p>
        </motion.div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-[24px] border border-border bg-card p-4">
                <Skeleton className="aspect-[16/10] w-full rounded-[18px]" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <p className="font-medium text-red-700 dark:text-red-400">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#d4432d] hover:bg-[#b83320] text-white"
            >
              Try again
            </Button>
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <ChefHat className="mx-auto mb-3 size-12 text-[#d4432d]" />
            <h3 className="text-lg font-bold text-foreground">No featured items available right now</h3>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((item, index) => (
              <motion.div key={item._id} {...get3ColSlide(index)} className="h-full">
                <MenuItemCard item={item} index={index} />
              </motion.div>
            ))}
          </div>
        )}

        {/* View Full Menu CTA Button */}
        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#d4432d] hover:bg-[#b83320] text-white font-bold uppercase px-8 py-5 text-xs sm:text-sm tracking-wider shadow-md shadow-[#d4432d]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Link href="/menu" className="flex items-center gap-2">
              <span>View Full Menu</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
