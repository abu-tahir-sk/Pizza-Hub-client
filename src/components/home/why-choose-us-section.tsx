"use client";

import { motion } from "motion/react";
import { BadgeCheck, Bike, MapPin } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const BENEFITS = [
  {
    icon: MapPin,
    title: "Local discovery, zero guesswork",
    desc: "Browse real neighbourhood kitchens with live menus, honest prices and photos of exactly what lands at your door.",
  },
  {
    icon: BadgeCheck,
    title: "Transparent reviews & prices",
    desc: "Every item is admin-approved and every review comes from a verified order. No hidden fees, no inflated markups.",
  },
  {
    icon: Bike,
    title: "Track every order",
    desc: "Follow your pizza from the oven to your doorstep with clear status updates at every step of the journey.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section id="why-choose" className="scroll-mt-24 bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-8 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d4432d]">
            Why Choose PizzaHub
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Built for hungry people and busy kitchens
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We connect passionate pizza lovers directly with the master pizzaiolos of their city.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d4432d]/40 hover:shadow-xl"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[#d4432d]/10 text-[#d4432d] transition-colors duration-300 group-hover:bg-[#d4432d] group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
