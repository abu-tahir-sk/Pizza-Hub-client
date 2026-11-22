"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Store, UtensilsCrossed } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export function VendorCtaSection() {
  return (
    <section className="bg-background pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e2374a] via-[#d01f3a] to-[#9f1029] px-6 py-10 shadow-2xl shadow-[#d4432d]/25 sm:px-10 sm:py-12 lg:px-14"
        >
          {/* Ambient glows */}
          <div className="pointer-events-none absolute -right-10 -top-16 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-[#f0a23c]/25 blur-3xl" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Store className="size-3.5" />
                Partner with PizzaHub
              </span>

              <h2 className="max-w-xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                Put your kitchen on the PizzaHub menu
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-white/80">
                Create a free vendor account, publish your signature dishes and start receiving
                orders from hungry customers across your city today.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/sign-up"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-xs font-bold uppercase tracking-wider text-[#b8142c] shadow-lg transition-all hover:bg-[#fff5f2] active:scale-[0.98]"
                >
                  Become a Vendor
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                >
                  <UtensilsCrossed className="size-4" />
                  Explore Menu
                </Link>
              </div>
            </div>

            <div className="relative mx-auto hidden size-48 shrink-0 sm:block lg:size-56">
              <div className="relative size-full overflow-hidden rounded-full ring-4 ring-white/20">
                <Image
                  src="/images/auth/auth-pizza-woodfired.jpg"
                  alt="Signature wood-fired pizza"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 grid size-14 place-items-center rounded-full border-4 border-[#c01c36] bg-[#f0a23c] text-center text-sm font-black leading-none text-[#3b1c12] shadow-xl">
                3+
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
