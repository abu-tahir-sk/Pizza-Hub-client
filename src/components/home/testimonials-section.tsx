"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const get3ColSlide = (index: number) => {
  const col = index % 3;
  const x = col === 0 ? -30 : col === 2 ? 30 : 0;
  return {
    initial: { opacity: 0, x, y: 20, scale: 0.98 },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: false, amount: 0.15 },
    transition: {
      duration: 0.45,
      delay: (index % 3) * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
};

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Verified Customer · Gulshan",
    comment:
      "The variety of independent local pizzerias here is incredible. The Margherita arrived bubbling hot within 25 minutes, with the freshest basil!",
    rating: 5,
    initials: "SJ",
  },
  {
    name: "David Kim",
    role: "Food Critic · Banani",
    comment:
      "Ordering is seamless and the vendor quality beats traditional big-chain delivery apps. Truly artisan wood-fired quality at great prices.",
    rating: 5,
    initials: "DK",
  },
  {
    name: "Emily Rodriguez",
    role: "Pizza Connoisseur · Dhanmondi",
    comment:
      "Special delivery instructions and custom notes were followed to the letter. PizzaHub has elevated Friday night dinner for our whole family!",
    rating: 5,
    initials: "ER",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-24 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Uniform Section Heading */}
        <motion.div {...fadeUp} className="mb-14 text-center space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f43f5e]">
            Customer Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground">
            What Pizza Lovers Say
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Authentic feedback from foodies who order their weekly pizza night through PizzaHub.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <motion.div key={t.name} {...get3ColSlide(index)} className="h-full">
              <Card className="h-full flex flex-col justify-between rounded-[24px] border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#f43f5e]/30">
                <CardContent className="p-0 space-y-4">
                  {/* Star Rating */}
                  <div className="flex gap-1 text-[#f59e0b]">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </CardContent>

                {/* Author Info */}
                <div className="flex items-center gap-3 border-t border-border/70 pt-4 mt-6">
                  <div className="grid size-10 place-items-center rounded-full bg-[#f43f5e]/10 text-[#f43f5e] font-bold text-xs">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
