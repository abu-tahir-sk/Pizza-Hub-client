"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const CATEGORIES = [
  {
    name: "Specialty / Gourmet Pizzas",
    subtitle: "Handcrafted with premium toppings",
    categoryParam: "Specialty",
    image: "/images/auth-pizza-desktop.jpg",
  },
  {
    name: "Sides & Appetizers",
    subtitle: "Gourmet fries, dips and garlic bread",
    categoryParam: "Sides",
    image: "/images/auth/pizza-black-bg-2.jpg",
  },
  {
    name: "Beverages & Desserts",
    subtitle: "Craft sodas and sweet finishes",
    categoryParam: "Beverages",
    image: "/images/auth/auth-pizza-woodfired.jpg",
  },
];

export function CategoriesSection() {
  return (
    <section className="bg-background py-14 sm:py-18 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.name}
              {...fadeUp}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="h-full"
            >
              <Link
                href={`/menu?category=${encodeURIComponent(cat.categoryParam)}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#1a110a] shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-2xl"
              >
                {/* Background image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark atmospheric vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                {/* Top corner subtle pill */}
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-md">
                    Featured
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold leading-snug text-white">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-300">
                      {cat.subtitle}
                    </p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-[#f43f5e]">
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
