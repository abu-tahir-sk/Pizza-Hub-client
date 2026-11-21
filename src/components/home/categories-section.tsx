"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const get3ColSlide = (index: number) => {
  const col = index % 3;
  const x = col === 0 ? -30 : col === 2 ? 30 : 0;
  return {
    initial: { opacity: 0, x, y: 20, scale: 0.98 },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
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
    count: "12 Items Available",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    desc: "Authentic wood-fired crusts with classic mozzarella and vine-ripened tomatoes.",
  },
  {
    name: "Vegetarian Pizzas",
    count: "9 Items Available",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    desc: "Farm-fresh bell peppers, roasted artichokes, olives, and fragrant fresh basil.",
  },
  {
    name: "Meat Lovers",
    count: "15 Items Available",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    desc: "Generously loaded with Italian sausage, crispy pepperoni, and cured meats.",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    count: "8 Items Available",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80",
    desc: "Truffle oil, burrata, wild mushrooms, and artisanal specialty combinations.",
  },
  {
    name: "Sides & Appetizers",
    count: "10 Items Available",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80",
    desc: "Garlic parmesan breadsticks, crispy chicken wings, and gourmet dips.",
  },
  {
    name: "Beverages & Desserts",
    count: "7 Items Available",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    desc: "Italian sodas, chilled brews, creamy tiramisu, and warm chocolate molten lava.",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 sm:py-24 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Uniform Section Heading */}
        <motion.div {...fadeUp} className="mb-14 text-center space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4432d]">
            Pizza Categories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground">
            Explore Signature Categories
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Discover your favorite style, from stone-baked classic crusts to decadent dessert creations.
          </p>
        </motion.div>

        {/* Categories Grid - Equal Height Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PIZZA_CATEGORIES.map((cat, index) => (
            <motion.div key={cat.name} {...get3ColSlide(index)} className="h-full">
              <Link
                href={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#d4432d]/40"
              >
                {/* Image Frame with Equal Aspect Ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  {/* Corner arrow icon button */}
                  <span className="absolute top-3.5 right-3.5 grid size-9 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#d4432d] group-hover:text-white">
                    <ArrowUpRight className="size-4 stroke-[2.5]" />
                  </span>

                  {/* Overlay Title & Count */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-[#f0a23c]">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-bold text-amber-300 mt-0.5">
                      {cat.count}
                    </p>
                  </div>
                </div>

                {/* Card Description */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
