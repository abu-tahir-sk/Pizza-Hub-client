"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Store } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export function VendorCtaSection() {
  return (
    <section className="bg-[#120b08] py-14 sm:py-20 border-t border-white/5 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#e11d48] via-[#e83d5a] to-[#f43f5e] px-6 py-10 shadow-2xl sm:px-10 sm:py-14 lg:px-14"
        >
          {/* Subtle dotted background overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff20_1.5px,transparent_1.5px)] [background-size:18px_18px] opacity-40" />

          {/* Ambient lighting */}
          <div className="pointer-events-none absolute -right-10 -top-16 size-80 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-amber-400/20 blur-3xl" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Left Content */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/15 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Store className="size-3.5" />
                FOR PIZZA KITCHENS
              </span>

              <h2 className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                Put your kitchen on the{" "}
                <span className="text-[#fde047]">PizzaHub menu</span>
              </h2>

              <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-white/90">
                Create a free vendor account, publish up to three approved menu items and
                start receiving orders. Upgrade to Premium when you are ready to sell more.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/sign-up"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-neutral-950 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:bg-neutral-900 active:scale-[0.98] cursor-pointer"
                >
                  <span>BECOME A VENDOR</span>
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 transition-colors hover:text-white hover:underline"
                >
                  <span>Or order from a local kitchen</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Visual: Pizza plate with yellow badge */}
            <div className="relative mx-auto hidden size-52 shrink-0 sm:block lg:size-64">
              <div className="relative size-full overflow-hidden rounded-full border-4 border-white/20 bg-neutral-900 shadow-2xl">
                <Image
                  src="/images/auth-pizza.jpg"
                  alt="Signature pizza platter"
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
              <span className="absolute -bottom-2 -left-2 grid size-12 place-items-center rounded-full border-2 border-neutral-950 bg-[#fbbf24] text-center text-sm font-black leading-none text-neutral-950 shadow-xl">
                3+
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
