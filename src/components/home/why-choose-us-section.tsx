"use client";

import { motion } from "motion/react";
import { Bike, ShieldCheck, Store } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const PILLARS = [
  {
    icon: Store,
    title: "Local kitchens, one menu",
    desc: "Independent pizza vendors manage their own listings, so every dish you see is live and ready to order.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewed before it goes live",
    desc: "Admin curators approve every menu item and store step in when an account breaks the rules.",
  },
  {
    icon: Bike,
    title: "Track every order",
    desc: "Follow your order from pending to accepted or rejected with full timestamped history.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section id="why-choose" className="scroll-mt-24 bg-[#120b08] py-14 sm:py-20 border-t border-white/5 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f43f5e]">
            WHY PIZZAHUB
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Built for hungry people and busy kitchens
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group h-full rounded-2xl border border-white/5 bg-[#1a110a] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-2xl"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[#f43f5e]/15 text-[#f43f5e] transition-colors duration-300 group-hover:bg-[#f43f5e] group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-400">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
