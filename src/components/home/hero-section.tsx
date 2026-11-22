"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock, Flame, MapPin, Star, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const STATS = [
  { icon: MapPin, value: "120+", label: "Local kitchens" },
  { icon: Star, value: "4.9", label: "Average rating" },
  { icon: Clock, value: "30 min", label: "Avg delivery" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* Warm ambient glows */}
      <div className="pointer-events-none absolute -top-32 right-[-10%] size-[520px] rounded-full bg-[#d4432d]/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] size-[420px] rounded-full bg-[#f0a23c]/15 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
        {/* Copy */}
        <motion.div {...fadeUp} className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4432d]/30 bg-[#d4432d]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#d4432d]">
            <Flame className="size-3.5 fill-[#d4432d]" />
            Fresh from the oven
          </span>

          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Hot &amp; Fresh Pizza
            <br />
            Delivered to <span className="text-[#d4432d]">Your Door</span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Discover neighbourhood pizzerias, browse wood-fired menus and order your
            favourite slice from verified local kitchens — delivered hot in under 30 minutes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="h-12 cursor-pointer rounded-full bg-[#d4432d] px-7 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#d4432d]/25 transition-all hover:bg-[#b83320] hover:shadow-xl active:scale-[0.98] sm:text-sm"
            >
              <Link href="/menu" className="flex items-center gap-2">
                <UtensilsCrossed className="size-4" />
                Explore Pizza Menu
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 cursor-pointer rounded-full border-border bg-card px-7 text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:border-[#d4432d]/40 hover:text-[#d4432d] sm:text-sm"
            >
              <Link href="/sign-up" className="flex items-center gap-2">
                Become a Vendor
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <dl className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-full bg-[#d4432d]/10 text-[#d4432d]">
                  <stat.icon className="size-4" />
                </span>
                <div>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-sm font-black leading-none text-foreground">{stat.value}</dd>
                  <dd className="mt-1 text-[11px] font-medium text-muted-foreground">{stat.label}</dd>
                </div>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Pizza visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <div className="relative aspect-square">
            {/* Rotating dashed ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-[#d4432d]/30"
            />
            <div className="absolute inset-[7%] overflow-hidden rounded-full shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
              <Image
                src="/images/auth-pizza.jpg"
                alt="Freshly baked artisan margherita pizza"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
                className="object-cover"
              />
            </div>

            {/* Floating rating chip */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-6 flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-3.5 py-2.5 shadow-xl backdrop-blur"
            >
              <span className="grid size-8 place-items-center rounded-full bg-amber-400/20 text-amber-500">
                <Star className="size-4 fill-current" />
              </span>
              <div>
                <p className="text-xs font-black leading-none text-foreground">4.9 / 5.0</p>
                <p className="mt-1 text-[10px] font-medium text-muted-foreground">2,400+ reviews</p>
              </div>
            </motion.div>

            {/* Floating delivery chip */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 right-0 flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-3.5 py-2.5 shadow-xl backdrop-blur"
            >
              <span className="grid size-8 place-items-center rounded-full bg-[#d4432d]/15 text-[#d4432d]">
                <Clock className="size-4" />
              </span>
              <div>
                <p className="text-xs font-black leading-none text-foreground">25–30 min</p>
                <p className="mt-1 text-[10px] font-medium text-muted-foreground">Hot delivery</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
