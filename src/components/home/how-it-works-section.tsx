"use client";

import { motion } from "motion/react";
import { Clock, Search, ShoppingBag } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Find your dish",
    desc: "Filter the full menu by category, kitchen location or price and open the item you want.",
  },
  {
    icon: ShoppingBag,
    step: "02",
    title: "Place your order",
    desc: "Pick a delivery date, confirm your address and send the order straight to the vendor. No card needed.",
  },
  {
    icon: Clock,
    step: "03",
    title: "Follow the timeline",
    desc: "Watch the vendor accept or reject it, and revisit every status change from your dashboard.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-[#120b08] py-14 sm:py-20 border-t border-white/5 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f43f5e]">
            HOW IT WORKS
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Three steps from craving to dinner
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="relative h-full overflow-hidden rounded-2xl border border-white/5 bg-[#1a110a] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-2xl"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-4 font-mono text-4xl sm:text-5xl font-black leading-none text-white/5 select-none"
                >
                  {step.step}
                </span>

                <span className="grid size-11 place-items-center rounded-xl bg-[#f43f5e]/15 text-[#f43f5e]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-400">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
