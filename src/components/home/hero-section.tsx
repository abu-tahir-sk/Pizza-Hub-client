"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Headphones,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface FallingIngredient {
  src: string;
  alt: string;
  className: string;
  initialRotate: number;
  finalRotate: number;
  delay: number;
  width: number;
  height: number;
}

interface SlideData {
  id: number;
  tag: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix?: string;
  subtitle: string;
  desc: string;
  pizzaSrc: string;
  pizzaAlt: string;
  ctaText: string;
  ctaLink: string;
  ingredients: FallingIngredient[];
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    tag: "100% HANDMADE & WOOD-FIRED",
    titlePrefix: "HOT & FRESH",
    titleHighlight: "PIZZA",
    titleSuffix: "DELIVERY",
    subtitle: "HEALTHY FOOD FOR HEALTHY BODY",
    desc: "Slow-fermented sourdough crust, sun-ripened San Marzano tomato sauce, and rich melted mozzarella baked to golden perfection in 450°C stone oven.",
    pizzaSrc: "/images/slider/pizza-supreme.png",
    pizzaAlt: "Artisan Supreme Pizza with Olives, Salami and Mozzarella",
    ctaText: "EXPLORE PIZZA MENU",
    ctaLink: "/menu",
    ingredients: [
      {
        src: "/images/slider/ingredient-chili-1.png",
        alt: "Fresh Red Chili",
        className: "top-[-8%] left-[-2%] sm:left-[2%] w-14 sm:w-20",
        initialRotate: -45,
        finalRotate: -15,
        delay: 0.15,
        width: 80,
        height: 120,
      },
      {
        src: "/images/slider/ingredient-garlic.png",
        alt: "Garlic Clove",
        className: "top-[-6%] left-[38%] sm:left-[42%] w-9 sm:w-12",
        initialRotate: 30,
        finalRotate: 10,
        delay: 0.25,
        width: 50,
        height: 60,
      },
      {
        src: "/images/slider/ingredient-basil-1.png",
        alt: "Organic Basil Leaves",
        className: "top-[-4%] right-[-2%] sm:right-[6%] w-14 sm:w-20",
        initialRotate: 40,
        finalRotate: 20,
        delay: 0.35,
        width: 80,
        height: 80,
      },
      {
        src: "/images/slider/ingredient-tomato-slice.png",
        alt: "Juicy Sliced Tomato",
        className: "top-[40%] right-[-10%] sm:right-[-6%] w-12 sm:w-16",
        initialRotate: -30,
        finalRotate: 15,
        delay: 0.45,
        width: 70,
        height: 70,
      },
      {
        src: "/images/slider/ingredient-onion.png",
        alt: "Aromatic Onion",
        className: "bottom-[2%] right-[6%] sm:right-[12%] w-9 sm:w-12",
        initialRotate: -20,
        finalRotate: -5,
        delay: 0.55,
        width: 50,
        height: 50,
      },
      {
        src: "/images/slider/ingredient-chili-2.png",
        alt: "Curved Red Pepper",
        className: "bottom-[6%] left-[-6%] sm:left-[0%] w-14 sm:w-20",
        initialRotate: 60,
        finalRotate: 35,
        delay: 0.65,
        width: 80,
        height: 100,
      },
      {
        src: "/images/slider/ingredient-herb.png",
        alt: "Fresh Green Herb",
        className: "top-[46%] left-[-12%] sm:left-[-8%] w-12 sm:w-16",
        initialRotate: -50,
        finalRotate: -25,
        delay: 0.75,
        width: 70,
        height: 70,
      },
    ],
  },
  {
    id: 2,
    tag: "CHEF SIGNATURE SPECIAL",
    titlePrefix: "WOOD-FIRED",
    titleHighlight: "ARTISAN",
    titleSuffix: "CRUST",
    subtitle: "AUTHENTIC NEAPOLITAN TASTE",
    desc: "Loaded with pan-roasted portobello mushrooms, fresh whole-milk mozzarella pearls, and fragrant sweet garden basil leaves.",
    pizzaSrc: "/images/slider/pizza-mushroom.png",
    pizzaAlt: "Portobello Mushroom and Mozzarella Pizza",
    ctaText: "EXPLORE PIZZA MENU",
    ctaLink: "/menu",
    ingredients: [
      {
        src: "/images/slider/ingredient-tomato-parsley.png",
        alt: "Cherry Tomato with Parsley",
        className: "top-[-8%] left-[6%] sm:left-[10%] w-14 sm:w-20",
        initialRotate: -35,
        finalRotate: -10,
        delay: 0.15,
        width: 80,
        height: 80,
      },
      {
        src: "/images/slider/ingredient-basil-2.png",
        alt: "Sweet Basil Branch",
        className: "top-[-6%] right-[10%] sm:right-[15%] w-14 sm:w-22",
        initialRotate: 45,
        finalRotate: 25,
        delay: 0.28,
        width: 85,
        height: 85,
      },
      {
        src: "/images/slider/ingredient-chili-1.png",
        alt: "Spicy Red Chili",
        className: "top-[35%] right-[-10%] sm:right-[-6%] w-14 sm:w-20",
        initialRotate: -40,
        finalRotate: -15,
        delay: 0.38,
        width: 80,
        height: 120,
      },
      {
        src: "/images/slider/ingredient-garlic.png",
        alt: "Garlic Clove",
        className: "bottom-[5%] right-[14%] sm:right-[20%] w-9 sm:w-12",
        initialRotate: 20,
        finalRotate: 5,
        delay: 0.48,
        width: 50,
        height: 60,
      },
      {
        src: "/images/slider/ingredient-tomato-slice.png",
        alt: "Fresh Tomato Slice",
        className: "bottom-[4%] left-[4%] sm:left-[10%] w-12 sm:w-16",
        initialRotate: -25,
        finalRotate: 12,
        delay: 0.58,
        width: 70,
        height: 70,
      },
      {
        src: "/images/slider/ingredient-onion.png",
        alt: "Onion Slice",
        className: "top-[38%] left-[-10%] sm:left-[-6%] w-10 sm:w-14",
        initialRotate: 50,
        finalRotate: 20,
        delay: 0.68,
        width: 55,
        height: 55,
      },
    ],
  },
  {
    id: 3,
    tag: "CRISPY & CHEESY CRUST",
    titlePrefix: "DELICIOUS &",
    titleHighlight: "CRISPY",
    titleSuffix: "SLICE",
    subtitle: "FRESH HOT PIZZA AT YOUR DOOR",
    desc: "Fresh vegetables, creamy mozzarella, rich tomato sauce, and crunchy crust seasoned with Mediterranean herbs delivered hot in 30 minutes.",
    pizzaSrc: "/images/slider/pizza-veggie.png",
    pizzaAlt: "Gourmet Artisan Veggie Pizza",
    ctaText: "EXPLORE PIZZA MENU",
    ctaLink: "/menu",
    ingredients: [
      {
        src: "/images/slider/ingredient-basil-1.png",
        alt: "Basil Leaves",
        className: "top-[-6%] left-[4%] sm:left-[12%] w-14 sm:w-20",
        initialRotate: -40,
        finalRotate: -15,
        delay: 0.15,
        width: 80,
        height: 80,
      },
      {
        src: "/images/slider/ingredient-chili-2.png",
        alt: "Red Chili",
        className: "top-[-8%] right-[12%] sm:right-[18%] w-14 sm:w-20",
        initialRotate: 50,
        finalRotate: 20,
        delay: 0.25,
        width: 80,
        height: 100,
      },
      {
        src: "/images/slider/ingredient-tomato-slice.png",
        alt: "Tomato Slice",
        className: "top-[40%] right-[-10%] sm:right-[-6%] w-12 sm:w-16",
        initialRotate: -35,
        finalRotate: 10,
        delay: 0.38,
        width: 70,
        height: 70,
      },
      {
        src: "/images/slider/ingredient-herb.png",
        alt: "Garden Herb",
        className: "bottom-[4%] right-[10%] sm:right-[16%] w-12 sm:w-16",
        initialRotate: 30,
        finalRotate: 0,
        delay: 0.48,
        width: 70,
        height: 70,
      },
      {
        src: "/images/slider/ingredient-garlic.png",
        alt: "Garlic",
        className: "bottom-[5%] left-[8%] sm:left-[15%] w-9 sm:w-12",
        initialRotate: -20,
        finalRotate: -5,
        delay: 0.58,
        width: 50,
        height: 60,
      },
      {
        src: "/images/slider/ingredient-chili-1.png",
        alt: "Hot Chili",
        className: "top-[42%] left-[-10%] sm:left-[-5%] w-14 sm:w-20",
        initialRotate: 45,
        finalRotate: 25,
        delay: 0.68,
        width: 80,
        height: 120,
      },
    ],
  },
];

const FEATURES = [
  {
    icon: Bike,
    title: "Fast Delivery",
    desc: "Hot, fresh pizza at your door in 30 minutes or less.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "Safe, simple checkout with trusted payment partners.",
  },
  {
    icon: CheckCircle2,
    title: "Top Quality",
    desc: "Fresh ingredients and dough prepared every morning.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Real people ready to help whenever you need us.",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 6.5 seconds when not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#100f12] text-white selection:bg-[#fb923c] selection:text-black"
    >
      {/* Dark Pizza Doodle Texture Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] z-0"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#fb923c 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px",
        }}
      />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 right-[-10%] size-[600px] rounded-full bg-[#f97316]/15 blur-[160px] z-0" />
      <div className="pointer-events-none absolute -bottom-40 left-[-10%] size-[600px] rounded-full bg-[#ef4444]/15 blur-[160px] z-0" />

      {/* Main Slider Area */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16 sm:pb-28 lg:px-8 lg:pt-20 lg:pb-32 min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex items-center">
        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="group absolute left-2 sm:left-4 lg:left-2 top-1/2 -translate-y-1/2 z-30 flex size-10 sm:size-12 items-center justify-center rounded-full bg-black/40 hover:bg-[#f97316] border border-white/10 hover:border-[#f97316] text-white/80 hover:text-white backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="size-6 sm:size-7 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="group absolute right-2 sm:right-4 lg:right-2 top-1/2 -translate-y-1/2 z-30 flex size-10 sm:size-12 items-center justify-center rounded-full bg-black/40 hover:bg-[#f97316] border border-white/10 hover:border-[#f97316] text-white/80 hover:text-white backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="size-6 sm:size-7 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Animated Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full grid items-center gap-10 lg:grid-cols-12 lg:gap-8 px-4 sm:px-8"
          >
            {/* Left Column: Animated Text */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 z-20">
              {/* Badge Tag */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#fb923c]"
              >
                <Sparkles className="size-3.5" />
                <span>{slide.tag}</span>
              </motion.div>

              {/* Main Typography Header */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-3"
              >
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                  <span>{slide.titlePrefix}</span>{" "}
                  <span className="text-[#fb923c] drop-shadow-[0_0_20px_rgba(251,146,60,0.45)]">
                    {slide.titleHighlight}
                  </span>
                  {slide.titleSuffix ? <span> {slide.titleSuffix}</span> : null}
                </h1>

                <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#fb923c]">
                  {slide.subtitle}
                </p>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="max-w-xl text-sm sm:text-base leading-relaxed text-neutral-300 font-normal"
              >
                {slide.desc}
              </motion.p>

              {/* CTA Buttons & Delivery Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#c2410c] px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(249,115,22,0.45)] hover:shadow-[0_0_40px_rgba(249,115,22,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="size-4" />
                </Link>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-300 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 backdrop-blur-sm">
                  <Clock className="size-4 text-[#fb923c]" />
                  <span>30 min average delivery</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Pizza + Falling Animated Ingredients */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]">
              {/* Radial warm lighting glow beneath the pizza */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute size-[320px] sm:size-[420px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.35)_0%,transparent_70%)] blur-2xl pointer-events-none"
              />

              {/* Main Rotating Pizza */}
              <motion.div
                initial={{ scale: 0.6, rotate: -40, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-[280px] sm:w-[380px] lg:w-[440px] xl:w-[480px] aspect-square select-none pointer-events-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)]"
              >
                {/* Continuous Slow 360-degree rotation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                  className="relative size-full"
                >
                  <Image
                    src={slide.pizzaSrc}
                    alt={slide.pizzaAlt}
                    fill
                    priority
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 480px"
                    className="object-contain"
                  />
                </motion.div>
              </motion.div>

              {/* Falling Ingredients around the Pizza */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {slide.ingredients.map((item, idx) => (
                  <motion.div
                    key={`${slide.id}-${idx}`}
                    initial={{
                      y: -220,
                      opacity: 0,
                      rotate: item.initialRotate,
                      scale: 0.5,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      rotate: item.finalRotate,
                      scale: 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 14,
                      delay: item.delay,
                    }}
                    className={`absolute ${item.className} drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]`}
                  >
                    {/* Floating gentle hover animation once dropped */}
                    <motion.div
                      animate={{
                        y: [-6, 6, -6],
                        rotate: [
                          item.finalRotate - 3,
                          item.finalRotate + 3,
                          item.finalRotate - 3,
                        ],
                      }}
                      transition={{
                        duration: 3.5 + idx * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        className="object-contain select-none"
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                current === idx
                  ? "w-8 bg-[#f97316] shadow-[0_0_12px_rgba(249,115,22,0.8)]"
                  : "w-2.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Feature Strip: 4 High-Contrast Sleek Cards */}
      <div className="relative z-10 w-full border-t border-white/10 bg-[#141218]/90 backdrop-blur-md px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10 shadow-lg"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange-500/20 text-[#fb923c] border border-orange-500/30">
                  <Icon className="size-6 stroke-[2]" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm font-normal text-neutral-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
