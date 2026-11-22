"use client";

import { motion } from "motion/react";
import { Bike, Search, ShoppingBag } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const STEPS = [
  {
    icon: Search,
    title: "Find your slice",
    desc: "Search by dish, filter by category or location, and compare live menus from kitchens near you.",
  },
  {
    icon: ShoppingBag,
    title: "Place your order",
    desc: "Pick a delivery date and address, add special instructions, and send it straight to the kitchen.",
  },
  {
    icon: Bike,
    title: "Follow the delivery",
    desc: "Watch your order move from pending to accepted, then enjoy it hot at your door.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-border bg-muted/30 py-16 transition-colors sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-8 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d4432d]">
            How PizzaHub Works
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Three steps from craving to dinner
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Ordering great pizza should be effortless — here is the whole journey.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d4432d]/40 hover:shadow-xl"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-3 text-4xl font-black leading-none text-muted-foreground/20"
                >
                  0{index + 1}
                </span>

                <span className="grid size-11 place-items-center rounded-xl bg-[#d4432d]/10 text-[#d4432d]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
