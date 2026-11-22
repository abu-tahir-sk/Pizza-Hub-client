"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const getCardMotion = (index: number) => {
  const col = index % 3;
  const x = col === 0 ? -24 : col === 2 ? 24 : 0;
  return {
    initial: { opacity: 0, x, y: 18 },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: {
      duration: 0.45,
      delay: (index % 3) * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
};

const PIZZA_CATEGORIES = [
  {
    name: "Classic Pizzas",
    count: "12 items",
    image: "/images/auth/auth-pizza-classic.jpg",
  },
  {
    name: "Vegetarian Pizzas",
    count: "9 items",
    image: "/images/auth/auth-pizza-woodfired.jpg",
  },
  {
    name: "Meat Lovers",
    count: "15 items",
    image: "/images/menu-banner-pizza.jpg",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    count: "8 items",
    image: "/images/auth-pizza-desktop.jpg",
  },
  {
    name: "Sides & Appetizers",
    count: "10 items",
    image:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Beverages & Desserts",
    count: "7 items",
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80",
  },
];

export function CategoriesSection() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d4432d]">
              Pizza Categories
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Browse by category
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#d4432d] transition-colors hover:text-[#b83320]"
          >
            View all menu
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PIZZA_CATEGORIES.map((cat, index) => (
            <motion.div key={cat.name} {...getCardMotion(index)} className="h-full">
              <Link
                href={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold leading-snug text-white sm:text-lg">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                      {cat.count}
                    </p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-[#d4432d]">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
