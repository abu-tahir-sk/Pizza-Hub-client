"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  Clock,
  Headphones,
  ShieldCheck,
  Star,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const FEATURES = [
  {
    icon: Bike,
    title: "Fast Delivery",
    desc: "Hot, fresh pizza at your door in 30 minutes or less.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "Safe, simple checkout with trusted payment partners.",
  },
  {
    icon: CheckCircle2,
    title: "Top Quality",
    desc: "Fresh ingredients and dough prepared every morning.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Real people ready to help whenever you need us.",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#120b08] text-white">
      {/* Background ambient lighting and subtle texture */}
      <div className="pointer-events-none absolute -top-40 right-[-5%] size-[600px] rounded-full bg-[#f43f5e]/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-[-10%] size-[500px] rounded-full bg-[#f59e0b]/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-20 lg:pb-24">
        {/* Top Split: Left Headline & CTA, Right Pizza Platter Visual */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* Left Column */}
          <motion.div {...fadeUp} className="space-y-6">
            {/* Tag / Pre-headline */}
            <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wide text-[#f59e0b]">
              <span className="h-[2px] w-6 bg-[#f59e0b]" />
              <span>Good Food. Good Mood!</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Delicious Pizza,
              <br />
              <span className="relative inline-block text-[#f59e0b]">
                Delivered to
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 250 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 5.5C50 2 150 1.5 248 5.5"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Your Door!
            </h1>

            {/* Description */}
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-neutral-300">
              Hand-tossed dough, stone-baked crusts and generous layers of melted cheese.
              Your next favourite pizza is hot, fresh and only minutes away.
            </p>

            {/* CTA and Delivery Indicator */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#f43f5e] to-[#e11d48] px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(244,63,94,0.45)] hover:shadow-[0_0_35px_rgba(244,63,94,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>BROWSE MENU</span>
                <ArrowRight className="size-4" />
              </Link>

              <div className="flex items-center gap-2.5 text-sm font-medium text-neutral-300">
                <span className="grid size-8 place-items-center rounded-full border border-white/20 text-neutral-300">
                  <Clock className="size-4" />
                </span>
                <span>30 min average delivery</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Pizza on round stone pan with floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[460px] lg:max-w-[500px]"
          >
            {/* Round stone platter container */}
            <div className="relative aspect-square">
              {/* Outer decorative halo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f43f5e]/15 to-[#f59e0b]/15 blur-2xl" />

              {/* Platter and Pizza Image */}
              <div className="relative size-full overflow-hidden rounded-full border-8 border-[#20150e] bg-[#1a0f09] shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
                <Image
                  src="/images/auth-pizza.jpg"
                  alt="Delicious artisan stone-baked pizza"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 500px"
                  className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
              </div>

              {/* Floating Badge 1: Top-Right Rating (4.9 / 5, 2K+ FOODIES) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 sm:-right-2 top-4 sm:top-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1a110a]/85 px-4 py-2.5 shadow-2xl backdrop-blur-md"
              >
                <span className="grid size-7 place-items-center rounded-full bg-amber-500/20 text-amber-400">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                </span>
                <div>
                  <div className="text-sm font-black text-white">4.9 / 5</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    2K+ FOODIES
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom-Left (Hot & fresh, AT YOUR DOOR IN 30 MIN) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 sm:bottom-4 left-0 sm:-left-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1a110a]/85 p-2.5 pr-4 shadow-2xl backdrop-blur-md"
              >
                <span className="grid size-9 place-items-center rounded-full bg-[#f43f5e] text-white">
                  <Bike className="size-5" />
                </span>
                <div>
                  <div className="text-xs font-bold text-white">Hot & fresh</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    AT YOUR DOOR IN 30 MIN
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Feature Strip: 4 rounded dark cards matching Image 1 */}
        <motion.div
          {...fadeUp}
          className="mt-14 sm:mt-18 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3.5 rounded-2xl border border-white/5 bg-[#1a110a]/70 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-[#1f140d]/80"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f43f5e]/15 text-[#f43f5e]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
