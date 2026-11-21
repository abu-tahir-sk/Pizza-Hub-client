"use client";

import Link from "next/link";
import { ArrowRight, Store, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VendorCtaSection() {
  return (
    <section className="border-t border-border bg-gradient-to-br from-[#1c0a06] via-[#2d120a] to-[#1a0805] text-white py-20 sm:py-24 transition-colors relative overflow-hidden">
      {/* Warm ambient pizza oven glows */}
      <div className="absolute top-0 right-1/4 size-96 rounded-full bg-[#f0a23c]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 size-96 rounded-full bg-[#d4432d]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#f0a23c] border border-white/15 backdrop-blur-md">
          <Store className="size-3.5" />
          <span>Partner with PizzaHub</span>
        </span>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
          Are You a Pizzeria Owner?<br />
          <span className="text-[#f0a23c]">Grow Your Orders</span> Today
        </h2>

        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Join PizzaHub as a verified vendor. Publish your signature artisan pizzas, accept real-time orders, and upgrade anytime to our Premium plan for unlimited items and featured placement.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#d4432d] hover:bg-[#b83320] text-white font-bold uppercase px-8 py-6 text-xs sm:text-sm tracking-wider shadow-xl shadow-red-950/60 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Link href="/sign-up" className="flex items-center gap-2">
              <Store className="size-4" />
              <span>Register as Vendor</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border border-white/40 bg-white/10 hover:bg-white hover:text-neutral-900 text-white font-bold uppercase px-8 py-6 text-xs sm:text-sm tracking-wider backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Link href="/menu" className="flex items-center gap-2">
              <UtensilsCrossed className="size-4" />
              <span>Explore Pizza Menu</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
