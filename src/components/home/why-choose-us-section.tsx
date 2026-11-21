"use client";

import { motion } from "motion/react";
import { Bike, Flame, ShieldCheck, Store } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const BENEFITS = [
  {
    icon: Flame,
    title: "Artisan Quality",
    desc: "Woodfired, slow-fermented 48-hour crusts topped with authentic San Marzano tomatoes and fior di latte mozzarella.",
  },
  {
    icon: Store,
    title: "Local Pizzerias",
    desc: "Support independent neighbourhood pizza masters and discover exclusive local recipe secrets.",
  },
  {
    icon: Bike,
    title: "Rapid Hot Delivery",
    desc: "Thermal-insulated temperature-controlled delivery bags keep every slice bubbling hot and crisp upon arrival.",
  },
  {
    icon: ShieldCheck,
    title: "100% Satisfaction",
    desc: "Real-time kitchen order tracking, instant cancellation for pending orders, and guaranteed food quality.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="border-t border-border bg-muted/20 py-20 sm:py-24 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Uniform Section Heading */}
        <motion.div {...fadeUp} className="mb-14 text-center space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4432d]">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground">
            The PizzaHub Difference
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Connecting passionate pizza lovers directly with master pizzaiolos in your city.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="group flex flex-col justify-between rounded-[24px] border border-border/80 bg-card p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#d4432d]/40"
              >
                <div>
                  <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-[#d4432d]/10 text-[#d4432d] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#d4432d] group-hover:text-white">
                    <Icon className="size-8" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
