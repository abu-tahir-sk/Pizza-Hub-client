"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bike,
  Check,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  MapPin,
  Plus,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import type { MenuItem } from "@/types";
import { MENU_CATEGORIES } from "@/lib/types";
import { fetchFeaturedMenu } from "@/lib/api";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const get3ColSlide = (index: number) => {
  const col = index % 3;
  const x = col === 0 ? -40 : col === 2 ? 40 : 0;
  return {
    initial: { opacity: 0, x, y: 25, scale: 0.97 },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: {
      duration: 0.5,
      delay: (index % 3) * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
};

/**
 * 3-Pizza Showcase Slides matching Barab Food Home 10 template:
 * - Center Pizza (larger, low center overlapping wave, with red + badge)
 * - Left Pizza (touching left screen edge, partially cropped)
 * - Right Pizza (touching right screen edge on wooden board, partially cropped)
 * - Left/Right circular slide buttons (<-- and -->)
 * - Clear gap and balanced spacing between the pizzas
 */
const PIZZA_SLIDES = [
  {
    id: "slide-1",
    subbadge: "WELCOME TO PIZZAHUB",
    title: "YOUR CITY'S BEST\nPIZZA SPOT",
    price: "$65",
    centerPizza: {
      image: "/images/hero/hero-10-2.jpg",
      name: "Pepperoni & Mushroom Mozzarella Special",
      price: "$65",
    },
    leftPizza: {
      image: "/images/hero/hero-10-1.jpg",
      name: "Classic Veggie Bell Pepper Supreme",
    },
    rightPizza: {
      image: "/images/hero/hero-10-3.jpg",
      name: "Rustic Woodfired Board Special",
    },
  },
  {
    id: "slide-2",
    subbadge: "WOODFIRED ARTISAN CRUST",
    title: "HOT & CRISPY\nSUPREME PIZZA",
    price: "$58",
    centerPizza: {
      image: "/images/hero/hero-10-3.jpg",
      name: "Rustic Woodfired Board Special",
      price: "$58",
    },
    leftPizza: {
      image: "/images/hero/hero-10-2.jpg",
      name: "Pepperoni & Mushroom Mozzarella Special",
    },
    rightPizza: {
      image: "/images/hero/hero-10-1.jpg",
      name: "Classic Veggie Bell Pepper Supreme",
    },
  },
  {
    id: "slide-3",
    subbadge: "FRESH FARM INGREDIENTS",
    title: "LOADED CHEESE\nVEGGIE DELIGHT",
    price: "$72",
    centerPizza: {
      image: "/images/hero/hero-10-1.jpg",
      name: "Classic Veggie Bell Pepper Supreme",
      price: "$72",
    },
    leftPizza: {
      image: "/images/hero/hero-10-3.jpg",
      name: "Rustic Woodfired Board Special",
    },
    rightPizza: {
      image: "/images/hero/hero-10-2.jpg",
      name: "Pepperoni & Mushroom Mozzarella Special",
    },
  },
];

// Required Pizza Categories
const PIZZA_CATEGORIES = [
  {
    name: "Classic Pizzas",
    count: "12 Items Available",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Vegetarian Pizzas",
    count: "9 Items Available",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Meat Lovers",
    count: "15 Items Available",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    count: "8 Items Available",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sides & Appetizers",
    count: "14 Items Available",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Beverages & Desserts",
    count: "10 Items Available",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = PIZZA_SLIDES[currentSlide];

  async function loadFeatured() {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchFeaturedMenu();
      setFeatured(items);
    } catch {
      setError("We couldn't load featured pizzas right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFeatured();
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? PIZZA_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % PIZZA_SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PIZZA_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-[#c8402b] selection:text-white">

      {/* ──────────────────────────────────────────────────────────
          1. Hero Showcase Banner (Barab Food Home 10 3-Pizza Spot)
      ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden w-full bg-[#0a2d20] text-white min-h-[580px] sm:min-h-[640px] md:min-h-[680px] lg:min-h-[740px] xl:min-h-[780px] flex flex-col justify-between pt-10 sm:pt-14 pb-0 select-none">

        {/* Subtle Dark Forest Green Radial Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_40%,#0e3c2c_0%,#0a2d20_65%,#051811_100%)]" />

        {/* Floating Blurred Mint/Basil Leaves & Cherry Tomato Decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
          {/* Top Left Leaf - with motion blur */}
          <div className="absolute top-10 left-[8%] sm:left-[10%] size-14 sm:size-20 rotate-[-25deg] blur-[1px] opacity-75">
            <svg viewBox="0 0 100 100" className="size-full fill-emerald-400/80">
              <path d="M20,80 Q10,30 50,10 Q90,30 80,80 Q50,90 20,80 Z" />
              <path d="M50,15 Q50,50 50,85" stroke="#052e1f" strokeWidth="2" fill="none" />
            </svg>
          </div>

          {/* Left Mid Leaf - soft blur */}
          <div className="absolute top-[45%] left-[18%] sm:left-[22%] size-16 sm:size-24 rotate-[45deg] blur-md opacity-40">
            <svg viewBox="0 0 100 100" className="size-full fill-emerald-300">
              <path d="M20,80 Q10,30 50,10 Q90,30 80,80 Q50,90 20,80 Z" />
            </svg>
          </div>

          {/* Top Right Cherry Tomato & Basil Leaves */}
          <div className="absolute top-14 right-[12%] sm:right-[15%] flex items-center gap-2">
            {/* Tomato */}
            <div className="size-9 sm:size-11 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-xl shadow-red-950/60 blur-[1px]" />
            {/* Attached Basil leaf */}
            <div className="size-12 sm:size-16 rotate-[35deg] blur-[2px] opacity-80">
              <svg viewBox="0 0 100 100" className="size-full fill-emerald-400">
                <path d="M20,80 Q10,30 50,10 Q90,30 80,80 Q50,90 20,80 Z" />
              </svg>
            </div>
          </div>

          {/* Bottom Right Floating Leaf */}
          <div className="absolute bottom-[28%] right-[22%] size-12 sm:size-16 rotate-[-55deg] blur-sm opacity-50">
            <svg viewBox="0 0 100 100" className="size-full fill-emerald-300">
              <path d="M20,80 Q10,30 50,10 Q90,30 80,80 Q50,90 20,80 Z" />
            </svg>
          </div>
        </div>

        {/* ─── Top Header Text & CTA Row (Centered) ─── */}
        <div className="relative z-30 mx-auto max-w-4xl px-4 text-center space-y-3 sm:space-y-4">
          {/* Subtitle Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-sub"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35 }}
              className="text-[#f59e0b] font-black uppercase tracking-[0.25em] text-xs sm:text-sm drop-shadow"
            >
              {slide.subbadge}
            </motion.div>
          </AnimatePresence>

          {/* Hero Main Heading */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={slide.id + "-title"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-black uppercase text-white tracking-tight leading-[1.05] drop-shadow-lg whitespace-pre-line"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          {/* Price & Add To Cart Ribbon Row */}
          {/* <div className="flex items-center justify-center gap-3 pt-1">
            <span className="text-xs sm:text-sm text-white/80 font-medium">Only</span>
            <span className="font-serif italic text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow">
              {slide.price}
            </span>
            <Button
              asChild
              className="bg-[#d3232a] hover:bg-[#b81d22] text-white font-black uppercase px-6 py-2 rounded-xs shadow-xl shadow-red-950/60 text-xs sm:text-sm tracking-wider transform -skew-x-6 hover:scale-105 active:scale-95 transition-all cursor-pointer h-auto border-0"
            >
              <Link href="/menu" className="flex items-center gap-1.5 transform skew-x-6">
                <span>ADD TO CART</span>
              </Link>
            </Button>
          </div> */}
        </div>

        {/* ─── Left Slide Arrow Button (<--) ─── */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-8 md:left-12 lg:left-16 top-[40%] sm:top-[42%] md:top-[44%] -translate-y-1/2 z-40 size-11 sm:size-13 rounded-full border border-white/60 hover:border-white text-white flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="size-5 sm:size-6 stroke-[1.5]" />
        </button>

        {/* ─── Right Slide Arrow Button (-->) ─── */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-8 md:right-12 lg:right-16 top-[40%] sm:top-[42%] md:top-[44%] -translate-y-1/2 z-40 size-11 sm:size-13 rounded-full border border-white/60 hover:border-white text-white flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all cursor-pointer shadow-lg"
        >
          <ArrowRight className="size-5 sm:size-6 stroke-[1.5]" />
        </button>

        {/* ─── 3-Pizza Layout Container: Left (attached to left), Center, Right (attached to right) ─── */}
        <div className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] lg:h-[480px] mt-auto">

          {/* 1. LEFT PIZZA (Attached to left side, partially cropped, no border, wide gap to center) */}
          <div className="absolute -left-20 sm:-left-24 md:-left-32 lg:-left-40 bottom-6 sm:bottom-10 md:bottom-14 z-10 size-[250px] sm:size-[310px] md:size-[380px] lg:size-[440px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-left"}
                initial={{ opacity: 0, x: -60, rotate: -25 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -60, rotate: -25 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative size-full rounded-full overflow-hidden shadow-2xl"
              >
                <Image
                  src={slide.leftPizza.image}
                  alt={slide.leftPizza.name}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 2. RIGHT PIZZA (Attached to right side, partially cropped, on wooden board, wide gap to center) */}
          <div className="absolute -right-20 sm:-right-24 md:-right-32 lg:-right-40 bottom-6 sm:bottom-10 md:bottom-14 z-10 size-[250px] sm:size-[310px] md:size-[380px] lg:size-[440px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-right"}
                initial={{ opacity: 0, x: 60, rotate: 25 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: 60, rotate: 25 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative size-full rounded-full overflow-hidden shadow-2xl"
              >
                <Image
                  src={slide.rightPizza.image}
                  alt={slide.rightPizza.name}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3. CENTER PIZZA (Larger, sitting low in center overlapping bottom wave, with red + badge) */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[28%] sm:translate-y-[30%] md:translate-y-[32%] z-20 size-[300px] sm:size-[380px] md:size-[460px] lg:size-[520px]">

            {/* Red + Circular Button on Top Center of Middle Pizza */}
            <button
              type="button"
              onClick={() => router.push("/menu")}
              aria-label="Add to cart / Customize"
              className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-40 size-8 sm:size-9 rounded-full bg-[#d3232a] hover:bg-[#b81d22] text-white flex items-center justify-center font-black text-xl shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer border-2 border-white/20"
            >
              <Plus className="size-4 sm:size-5 stroke-[3]" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-center"}
                initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 15 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative size-full rounded-full overflow-hidden shadow-2xl ring-4 ring-black/20"
              >
                <Image
                  src={slide.centerPizza.image}
                  alt={slide.centerPizza.name}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* ─── Bottom Scalloped Wave Shape (Smooth transition into next section) ─── */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-25 pointer-events-none overflow-hidden leading-none">
          <svg
            className="w-full h-8 sm:h-12 md:h-16 lg:h-20 text-muted/30 fill-current block"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path d="M0,80 L0,30 Q30,0 60,30 Q90,60 120,30 Q150,0 180,30 Q210,60 240,30 Q270,0 300,30 Q330,60 360,30 Q390,0 420,30 Q450,60 480,30 Q510,0 540,30 Q570,60 600,30 Q630,0 660,30 Q690,60 720,30 Q750,0 780,30 Q810,60 840,30 Q870,0 900,30 Q930,60 960,30 Q990,0 1020,30 Q1050,60 1080,30 Q1110,0 1140,30 Q1170,60 1200,30 Q1230,0 1260,30 Q1290,60 1320,30 Q1350,0 1380,30 Q1410,60 1440,30 L1440,80 Z" />
          </svg>
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────
          2. DYNAMIC SECTION 1: Featured Menu Items (Approved & Active)
      ────────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30 py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <motion.div {...fadeUp} className="mb-12 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d82a2a]">
              Chef&apos;s Specials
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              Featured Menu Items
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Handpicked active and approved specialties from verified top-rated local pizzerias.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3 rounded-[24px] border border-border bg-card p-4">
                  <Skeleton className="aspect-[16/10] w-full rounded-[18px]" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
              <p className="font-medium text-red-700 dark:text-red-400">{error}</p>
              <Button onClick={loadFeatured} className="mt-4 bg-[#c8402b] hover:bg-[#ad3521]">
                Try again
              </Button>
            </div>
          ) : featured.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <ChefHat className="mx-auto mb-3 size-12 text-[#c8402b]" />
              <h3 className="text-lg font-bold text-foreground">No featured items available right now</h3>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 6).map((item, index) => (
                <motion.div key={item._id} {...get3ColSlide(index)}>
                  <MenuItemCard item={item} index={index} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#d82a2a] hover:bg-[#b81e1e] text-white font-bold uppercase px-8 text-xs tracking-wider shadow-md cursor-pointer"
            >
              <Link href="/menu" className="flex items-center gap-2">
                <span>View Full Menu</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. STATIC SECTION 1: Pizza Categories Showcase (Required Categories)
      ────────────────────────────────────────────────────────── */}
      <section className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <motion.div {...fadeUp} className="mb-12 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d82a2a]">
              Categories
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              Explore Our Signature Categories
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Find your favorite style, from stone-baked classic crusts to decadent dessert creations.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PIZZA_CATEGORIES.map((cat, index) => (
              <motion.div key={cat.name} {...get3ColSlide(index)}>
                <Link
                  href={`/menu?category=${encodeURIComponent(cat.name)}`}
                  className="group relative block overflow-hidden rounded-[26px] border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#c8402b]/40"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-black uppercase tracking-tight text-white">
                        {cat.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                        {cat.count}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. STATIC SECTION 2: Why Choose PizzaHub
      ────────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/20 py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <motion.div {...fadeUp} className="mb-14 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d82a2a]">
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              The PizzaHub Difference
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              We connect hungry foodies with passionate artisan pizza makers.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Flame,
                title: "Artisan Quality",
                desc: "Woodfired, slow-fermented crusts made with premium ingredients.",
              },
              {
                icon: Store,
                title: "Local Pizzerias",
                desc: "Discover verified independent vendors in your neighborhood.",
              },
              {
                icon: Bike,
                title: "Rapid Delivery",
                desc: "Insulated hot bag delivery keeps your crust crispy and cheese bubbly.",
              },
              {
                icon: ShieldCheck,
                title: "100% Satisfaction",
                desc: "Real-time order tracking and verified customer guarantees.",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  {...fadeUp}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="rounded-[24px] border border-border bg-card p-6 text-center shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#c8402b]/30"
                >
                  <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-[#c8402b]/10 text-[#c8402b]">
                    <Icon className="size-7" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight text-foreground mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. STATIC SECTION 3: Customer Reviews / Testimonials
      ────────────────────────────────────────────────────────── */}
      <section className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <motion.div {...fadeUp} className="mb-14 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d82a2a]">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              What Pizza Lovers Say
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Real feedback from foodies who order their weekly pizza night through PizzaHub.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Jenkins",
                role: "Pizza Enthusiast",
                comment: "The variety of independent local pizzerias here is incredible. The Margherita arrived bubbling hot within 30 minutes!",
                rating: 5,
              },
              {
                name: "David Kim",
                role: "Food Blogger",
                comment: "Ordering is seamless and the vendor options beat any traditional delivery app. Truly artisan quality at great prices.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Family Meal Planner",
                comment: "Custom requests and delivery instructions were followed to the letter. PizzaHub has made Friday night dinner so easy!",
                rating: 5,
              },
            ].map((t, index) => (
              <motion.div key={t.name} {...get3ColSlide(index)}>
                <Card className="rounded-[24px] border-border bg-card p-6 shadow-sm">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex gap-1 text-[#f59e0b]">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                    <div className="border-t border-border pt-3">
                      <p className="text-sm font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. STATIC SECTION 4: Vendor Partner CTA
      ────────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-gradient-to-br from-[#0a2d20] to-[#051811] text-white py-16 transition-colors">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#f59e0b]">
            Partner with PizzaHub
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Are You a Pizzeria Owner?<br />Grow Your Orders Today
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/70 max-w-xl mx-auto leading-relaxed">
            Join PizzaHub as a verified vendor. List your signature pies, manage live incoming orders, and upgrade anytime to our Premium tier for unlimited listings.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#d3232a] hover:bg-[#b81d22] text-white font-black uppercase px-8 text-xs tracking-wider shadow-xl shadow-red-950/60"
            >
              <Link href="/sign-up">Register as Vendor</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border border-white/60 bg-transparent text-white hover:bg-white hover:text-[#0a2d20] font-black uppercase px-8 text-xs tracking-wider"
            >
              <Link href="/menu">Explore Menu</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
