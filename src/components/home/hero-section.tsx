"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((curr) => (curr === 0 ? PIZZA_SLIDES.length - 1 : curr - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((curr) => (curr === PIZZA_SLIDES.length - 1 ? 0 : curr + 1));
  };

  const slide = PIZZA_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf8f5] via-[#f7f2ed] to-[#f0e9e2] dark:from-[#18110e] dark:via-[#1c130f] dark:to-[#140e0b] pt-10 sm:pt-14 pb-36 sm:pb-48 md:pb-56 transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[#f0a23c]/15 dark:bg-[#d4432d]/10 blur-[140px] pointer-events-none" />

      {/* Top Banner Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        {/* Sub-badge pill */}
        <motion.div
          key={slide.subbadge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#d4432d]/10 dark:bg-[#d4432d]/20 border border-[#d4432d]/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#d4432d]"
        >
          <Flame className="size-3.5 fill-[#d4432d]" />
          <span>{slide.subbadge}</span>
        </motion.div>

        {/* Main Hero Heading */}
        <motion.h1
          key={slide.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-neutral-900 dark:text-white leading-[1.05]"
        >
          {slide.title.split("\n").map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        {/* Short description */}
        <p className="mx-auto max-w-xl text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Order oven-fresh artisan pizzas from verified local kitchens or join as a vendor to scale your culinary business.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#d4432d] hover:bg-[#b83320] text-white font-bold uppercase px-8 py-6 text-xs sm:text-sm tracking-wider shadow-lg shadow-[#d4432d]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Link href="/menu" className="flex items-center gap-2">
              <UtensilsCrossed className="size-4" />
              <span>Explore Pizza Menu</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 font-bold uppercase px-8 py-6 text-xs sm:text-sm tracking-wider backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/sign-up" className="flex items-center gap-2">
              <span>Become a Vendor</span>
              <ArrowRight className="size-4 text-[#d4432d]" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 3-Pizza Showcase Container */}
      <div className="relative mt-8 sm:mt-12 w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px]">
        {/* Left Slider Arrow Button */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous pizza slide"
          className="absolute left-3 sm:left-8 md:left-14 top-1/2 -translate-y-1/2 z-40 grid size-10 sm:size-12 md:size-14 place-items-center rounded-full bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white shadow-xl backdrop-blur-md transition-transform hover:scale-110 active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="size-5 sm:size-6 stroke-[2.5]" />
        </button>

        {/* Right Slider Arrow Button */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next pizza slide"
          className="absolute right-3 sm:right-8 md:right-14 top-1/2 -translate-y-1/2 z-40 grid size-10 sm:size-12 md:size-14 place-items-center rounded-full bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white shadow-xl backdrop-blur-md transition-transform hover:scale-110 active:scale-90 cursor-pointer"
        >
          <ChevronRight className="size-5 sm:size-6 stroke-[2.5]" />
        </button>

        {/* 1. LEFT PIZZA */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[25%] sm:-translate-x-[20%] z-10 size-[200px] sm:size-[280px] md:size-[380px] lg:size-[440px] pointer-events-none opacity-85">
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

        {/* 2. RIGHT PIZZA */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[25%] sm:translate-x-[20%] z-10 size-[200px] sm:size-[280px] md:size-[380px] lg:size-[440px] pointer-events-none opacity-85">
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

        {/* 3. CENTER PIZZA */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[28%] sm:translate-y-[30%] md:translate-y-[32%] z-20 size-[300px] sm:size-[380px] md:size-[460px] lg:size-[520px]">
          {/* Red + Circular Action Button on Middle Pizza */}
          <button
            type="button"
            onClick={() => router.push("/menu")}
            aria-label="Explore and customize pizza"
            className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-40 size-8 sm:size-9 rounded-full bg-[#d4432d] hover:bg-[#b83320] text-white flex items-center justify-center font-black text-xl shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer border-2 border-white/20"
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

      {/* Bottom Scalloped Wave Shape */}
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
  );
}
