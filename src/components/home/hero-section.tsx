"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Bike,
  CheckCircle2,
  Headphones,
  ShieldCheck,
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

interface PizzaSlide {
  id: number;
  tag: string;
  name: string;
  ingredientsText: string;
  price: string;
  thumbnailPrice: string;
  pizzaSrc: string;
  alt: string;
  ingredients: FallingIngredient[];
}

const PIZZAS: PizzaSlide[] = [
  {
    id: 1,
    tag: "Today's Special",
    name: "Margherita Pizza",
    ingredientsText:
      "Fresh whole-milk mozzarella pearls, San Marzano sweet tomato sauce, aromatic garden basil leaves, and cold-pressed extra virgin olive oil on stone-baked crust.",
    price: "$18.25",
    thumbnailPrice: "$25.50",
    pizzaSrc: "/images/slider/pizza-margherita.jpg",
    alt: "Artisan Margherita Pizza with Fresh Basil and Melted Mozzarella",
    ingredients: [
      {
        src: "/images/slider/ingredient-chili-1.png",
        alt: "Fresh Red Chili",
        className: "top-[-6%] left-[-2%] sm:left-[2%] w-12 sm:w-16",
        initialRotate: -45,
        finalRotate: -15,
        delay: 0.15,
        width: 70,
        height: 100,
      },
      {
        src: "/images/slider/ingredient-onion.png",
        alt: "Onion Slice",
        className: "top-[-5%] right-[6%] sm:right-[14%] w-9 sm:w-12",
        initialRotate: 35,
        finalRotate: 15,
        delay: 0.25,
        width: 50,
        height: 50,
      },
      {
        src: "/images/slider/ingredient-basil-1.png",
        alt: "Organic Basil Leaf",
        className: "top-[32%] right-[-10%] sm:right-[-6%] w-12 sm:w-16",
        initialRotate: 40,
        finalRotate: 20,
        delay: 0.35,
        width: 75,
        height: 75,
      },
      {
        src: "/images/slider/ingredient-tomato-slice.png",
        alt: "Juicy Tomato Slice",
        className: "bottom-[8%] right-[4%] sm:right-[12%] w-11 sm:w-14",
        initialRotate: -30,
        finalRotate: 15,
        delay: 0.45,
        width: 65,
        height: 65,
      },
      {
        src: "/images/slider/ingredient-garlic.png",
        alt: "Garlic Clove",
        className: "bottom-[5%] left-[6%] sm:left-[12%] w-8 sm:w-11",
        initialRotate: 20,
        finalRotate: 5,
        delay: 0.55,
        width: 45,
        height: 55,
      },
      {
        src: "/images/slider/ingredient-herb.png",
        alt: "Green Herb",
        className: "top-[40%] left-[-12%] sm:left-[-6%] w-11 sm:w-15",
        initialRotate: -50,
        finalRotate: -20,
        delay: 0.65,
        width: 65,
        height: 65,
      },
    ],
  },
  {
    id: 2,
    tag: "Chef's Recommendation",
    name: "Pepperoni Feast",
    ingredientsText:
      "Crispy artisan pepperoni cups, aged provolone, spicy herb marinara, melted whole-milk mozzarella, and fragrant oregano on golden blistered sourdough crust.",
    price: "$21.50",
    thumbnailPrice: "$21.50",
    pizzaSrc: "/images/slider/pizza-supreme.png",
    alt: "Pepperoni Feast Pizza with Spicy Slices and Melted Cheese",
    ingredients: [
      {
        src: "/images/slider/ingredient-chili-2.png",
        alt: "Curved Red Pepper",
        className: "top-[-8%] left-[8%] sm:left-[14%] w-12 sm:w-16",
        initialRotate: 50,
        finalRotate: 25,
        delay: 0.15,
        width: 70,
        height: 90,
      },
      {
        src: "/images/slider/ingredient-onion.png",
        alt: "Sliced Onion Ring",
        className: "top-[36%] right-[-10%] sm:right-[-6%] w-10 sm:w-13",
        initialRotate: -25,
        finalRotate: -5,
        delay: 0.28,
        width: 55,
        height: 55,
      },
      {
        src: "/images/slider/ingredient-basil-2.png",
        alt: "Sweet Basil Sprig",
        className: "top-[-6%] right-[10%] sm:right-[18%] w-12 sm:w-16",
        initialRotate: 45,
        finalRotate: 20,
        delay: 0.38,
        width: 75,
        height: 75,
      },
      {
        src: "/images/slider/ingredient-tomato-slice.png",
        alt: "Fresh Tomato Slice",
        className: "bottom-[6%] right-[6%] sm:right-[14%] w-11 sm:w-15",
        initialRotate: -35,
        finalRotate: 12,
        delay: 0.48,
        width: 65,
        height: 65,
      },
      {
        src: "/images/slider/ingredient-chili-1.png",
        alt: "Spicy Red Chili",
        className: "bottom-[8%] left-[-4%] sm:left-[2%] w-12 sm:w-16",
        initialRotate: 60,
        finalRotate: 30,
        delay: 0.58,
        width: 70,
        height: 100,
      },
      {
        src: "/images/slider/ingredient-garlic.png",
        alt: "Garlic",
        className: "top-[42%] left-[-10%] sm:left-[-5%] w-8 sm:w-11",
        initialRotate: -30,
        finalRotate: -10,
        delay: 0.68,
        width: 45,
        height: 55,
      },
    ],
  },
  {
    id: 3,
    tag: "Wood-Fired Signature",
    name: "Rustic Mushroom",
    ingredientsText:
      "Pan-roasted portobello and cremini mushrooms, slow-roasted garlic cloves, creamy fontina cheese, wild mountain thyme, and delicate white truffle drizzle.",
    price: "$23.00",
    thumbnailPrice: "$23.00",
    pizzaSrc: "/images/slider/pizza-mushroom.png",
    alt: "Rustic Portobello Mushroom and Fontina Pizza",
    ingredients: [
      {
        src: "/images/slider/ingredient-tomato-parsley.png",
        alt: "Cherry Tomato with Parsley",
        className: "top-[-8%] left-[4%] sm:left-[10%] w-12 sm:w-16",
        initialRotate: -35,
        finalRotate: -10,
        delay: 0.15,
        width: 70,
        height: 70,
      },
      {
        src: "/images/slider/ingredient-onion.png",
        alt: "Aromatic Onion",
        className: "top-[-5%] right-[8%] sm:right-[15%] w-9 sm:w-12",
        initialRotate: 40,
        finalRotate: 15,
        delay: 0.25,
        width: 50,
        height: 50,
      },
      {
        src: "/images/slider/ingredient-chili-1.png",
        alt: "Red Chili",
        className: "top-[38%] right-[-10%] sm:right-[-6%] w-12 sm:w-16",
        initialRotate: -40,
        finalRotate: -15,
        delay: 0.38,
        width: 70,
        height: 100,
      },
      {
        src: "/images/slider/ingredient-garlic.png",
        alt: "Whole Garlic Clove",
        className: "bottom-[6%] right-[8%] sm:right-[16%] w-8 sm:w-11",
        initialRotate: 20,
        finalRotate: 5,
        delay: 0.48,
        width: 45,
        height: 55,
      },
      {
        src: "/images/slider/ingredient-basil-1.png",
        alt: "Basil Leaves",
        className: "bottom-[5%] left-[2%] sm:left-[8%] w-12 sm:w-16",
        initialRotate: -25,
        finalRotate: 10,
        delay: 0.58,
        width: 75,
        height: 75,
      },
      {
        src: "/images/slider/ingredient-herb.png",
        alt: "Mountain Herb",
        className: "top-[44%] left-[-10%] sm:left-[-5%] w-10 sm:w-14",
        initialRotate: 50,
        finalRotate: 20,
        delay: 0.68,
        width: 60,
        height: 60,
      },
    ],
  },
  {
    id: 4,
    tag: "Garden Fresh",
    name: "Veggie Supreme",
    ingredientsText:
      "Charred bell peppers, kalamata olives, red onions, roasted sweet corn, ripe cherry tomatoes, and seasoned feta on slow-fermented Italian sourdough crust.",
    price: "$19.75",
    thumbnailPrice: "$19.75",
    pizzaSrc: "/images/slider/pizza-garden.jpg",
    alt: "Garden Veggie Supreme Pizza with Fresh Vegetables",
    ingredients: [
      {
        src: "/images/slider/ingredient-chili-1.png",
        alt: "Red Chili",
        className: "top-[-6%] left-[6%] sm:left-[12%] w-12 sm:w-16",
        initialRotate: -45,
        finalRotate: -15,
        delay: 0.15,
        width: 70,
        height: 100,
      },
      {
        src: "/images/slider/ingredient-onion.png",
        alt: "Sliced Onion",
        className: "top-[-6%] right-[10%] sm:right-[16%] w-9 sm:w-12",
        initialRotate: 30,
        finalRotate: 10,
        delay: 0.25,
        width: 50,
        height: 50,
      },
      {
        src: "/images/slider/ingredient-basil-2.png",
        alt: "Basil Branch",
        className: "top-[36%] right-[-10%] sm:right-[-6%] w-12 sm:w-16",
        initialRotate: 40,
        finalRotate: 18,
        delay: 0.38,
        width: 75,
        height: 75,
      },
      {
        src: "/images/slider/ingredient-tomato-slice.png",
        alt: "Tomato Slice",
        className: "bottom-[7%] right-[6%] sm:right-[15%] w-11 sm:w-15",
        initialRotate: -30,
        finalRotate: 15,
        delay: 0.48,
        width: 65,
        height: 65,
      },
      {
        src: "/images/slider/ingredient-garlic.png",
        alt: "Garlic",
        className: "bottom-[5%] left-[4%] sm:left-[10%] w-8 sm:w-11",
        initialRotate: 25,
        finalRotate: 5,
        delay: 0.58,
        width: 45,
        height: 55,
      },
      {
        src: "/images/slider/ingredient-herb.png",
        alt: "Herb Leaf",
        className: "top-[40%] left-[-12%] sm:left-[-6%] w-10 sm:w-14",
        initialRotate: -45,
        finalRotate: -18,
        delay: 0.68,
        width: 60,
        height: 60,
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

  // Auto-rotate pizza slides every 6.5s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % PIZZAS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const active = PIZZAS[current];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-gradient-to-b from-rose-50/40 via-background to-background dark:from-[#141316] dark:via-[#161519] dark:to-[#141316] text-foreground transition-colors selection:bg-[#f43f5e] selection:text-white"
    >
      {/* Scattered Organic Floating Leaves matching reference */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {/* Top-left floating basil leaf */}
        <motion.div
          animate={{ y: [-6, 6, -6], rotate: [-15, -5, -15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-3 left-4 sm:left-12 w-14 sm:w-20 opacity-80 dark:opacity-90 drop-shadow-md"
        >
          <Image
            src="/images/slider/ingredient-basil-1.png"
            alt="Fresh Basil Leaf"
            width={80}
            height={80}
            className="object-contain"
          />
        </motion.div>

        {/* Mid-left floating basil leaf */}
        <motion.div
          animate={{ y: [6, -6, 6], rotate: [25, 40, 25] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute top-1/2 -left-4 sm:left-8 w-12 sm:w-16 opacity-75 dark:opacity-80 drop-shadow-md"
        >
          <Image
            src="/images/slider/ingredient-basil-2.png"
            alt="Organic Basil Branch"
            width={70}
            height={70}
            className="object-contain"
          />
        </motion.div>

        {/* Center-bottom tilted basil leaf (near big pizza) */}
        <motion.div
          animate={{ y: [-5, 5, -5], rotate: [-20, -8, -20] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="absolute bottom-28 left-1/2 -translate-x-12 sm:translate-x-0 sm:left-[45%] w-14 sm:w-18 opacity-80 dark:opacity-90 drop-shadow-md"
        >
          <Image
            src="/images/slider/ingredient-basil-1.png"
            alt="Tilted Basil Leaf"
            width={75}
            height={75}
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* Main Hero Container */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20 lg:px-8 lg:pt-18 lg:pb-24 min-h-[580px] lg:min-h-[660px] flex items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Text Content & Bottom Pizza Thumbnails */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 z-20">
            {/* Animated Text Block */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Red Subtitle: Today's Special */}
                <p className="text-sm sm:text-base font-semibold tracking-wide text-[#f43f5e]">
                  {active.tag}
                </p>

                {/* Big Bold Headline: Pizza Name */}
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground dark:text-white leading-[1.08]">
                  {active.name}
                </h1>

                {/* Ingredients description */}
                <p className="max-w-md text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground dark:text-neutral-300 font-normal">
                  <span className="font-semibold text-foreground dark:text-white/90">Ingredient: </span>
                  {active.ingredientsText}
                </p>

                {/* Price and View Menu Action */}
                <div className="flex items-center gap-6 pt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-white tracking-tight">
                    {active.price}
                  </span>

                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f43f5e] to-[#e11d48] hover:from-[#e11d48] hover:to-[#be123c] px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#f43f5e]/30 hover:shadow-[#f43f5e]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    View Menu
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom-Left Pizza Thumbnails Row */}
            <div className="pt-4 sm:pt-6">
              <div className="flex items-end gap-2.5 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
                {PIZZAS.map((item, idx) => {
                  const isActive = current === idx;
                  return (
                    <div key={item.id} className="relative shrink-0">
                      {isActive ? (
                        /* Selected Active Thumbnail: Elevated White Arch Card */
                        <motion.div
                          layoutId="active-pizza-indicator"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                          className="relative bg-card dark:bg-[#1e1b24] text-card-foreground dark:text-white rounded-t-full rounded-b-2xl pt-2 pb-3 px-2 sm:px-3 shadow-xl dark:shadow-2xl flex flex-col items-center justify-center min-w-[85px] sm:min-w-[105px] text-center border-2 border-[#f43f5e] cursor-pointer"
                        >
                          <div className="relative size-16 sm:size-20 rounded-full overflow-hidden shadow-md">
                            <Image
                              src={item.pizzaSrc}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[11px] sm:text-xs font-black text-foreground dark:text-white leading-tight mt-1.5 max-w-[85px] sm:max-w-[100px] truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] sm:text-[11px] font-bold text-[#f43f5e] mt-0.5">
                            {item.thumbnailPrice}
                          </p>
                        </motion.div>
                      ) : (
                        /* Inactive Thumbnail: Simple circular pizza button */
                        <button
                          type="button"
                          onClick={() => setCurrent(idx)}
                          aria-label={`Select ${item.name}`}
                          className="group relative rounded-full size-16 sm:size-20 p-0.5 transition-all duration-300 hover:scale-110 cursor-pointer opacity-75 hover:opacity-100 flex items-center justify-center"
                        >
                          <div className="size-full rounded-full overflow-hidden shadow-md border-2 border-border dark:border-white/10 group-hover:border-[#f43f5e] transition-colors relative">
                            <Image
                              src={item.pizzaSrc}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Big Sliding/Rotating Pizza + Falling Animated Ingredients */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end overflow-visible min-h-[380px] sm:min-h-[460px] lg:min-h-[560px]">
            {/* Warm subtle ambient glow behind the pizza */}
            <div className="absolute size-[340px] sm:size-[460px] lg:size-[560px] rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.18)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(244,63,94,0.25)_0%,transparent_70%)] blur-3xl pointer-events-none" />

            {/* Sliding Big Pizza on Selection Change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ x: 120, rotate: 40, opacity: 0, scale: 0.85 }}
                animate={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
                exit={{ x: -120, rotate: -40, opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 85, damping: 16 }}
                className="relative z-10 w-[290px] sm:w-[420px] md:w-[480px] lg:w-[560px] xl:w-[620px] aspect-square select-none lg:-mr-12 xl:-mr-16 drop-shadow-[0_20px_45px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
              >
                {/* Continuous Slow Ambient 360 Rotation Floating Effect */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
                  className="relative size-full rounded-full overflow-hidden"
                >
                  <Image
                    src={active.pizzaSrc}
                    alt={active.alt}
                    fill
                    priority
                    sizes="(max-width: 640px) 290px, (max-width: 1024px) 480px, 620px"
                    className="object-cover"
                  />
                </motion.div>

                {/* Animated Falling Ingredients (Chili, Onion, Garlic, Basil, Herbs) around the Pizza */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  {active.ingredients.map((item, idx) => (
                    <motion.div
                      key={`${active.id}-${idx}`}
                      initial={{
                        y: -220,
                        opacity: 0,
                        rotate: item.initialRotate,
                        scale: 0.4,
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        rotate: item.finalRotate,
                        scale: 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 85,
                        damping: 14,
                        delay: item.delay,
                      }}
                      className={`absolute ${item.className} drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] dark:drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)]`}
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Feature Strip: 4 Sleek Clean Theme-Adaptive Cards */}
      <div className="relative z-20 w-full border-t border-border dark:border-white/10 bg-muted/40 dark:bg-[#0e0d10]/95 backdrop-blur-md px-4 py-7 sm:px-6 lg:px-8 transition-colors">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3.5 rounded-2xl border border-border dark:border-white/5 bg-card/90 dark:bg-white/[0.04] p-4 backdrop-blur-md transition-all duration-300 hover:border-[#f43f5e]/40 hover:shadow-md dark:hover:bg-white/[0.07] shadow-xs"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/25">
                  <Icon className="size-5 stroke-[2.2]" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground dark:text-white">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground dark:text-neutral-400 leading-relaxed font-normal">
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
