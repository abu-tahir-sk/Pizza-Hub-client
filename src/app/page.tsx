"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  ChefHat,
  Flame,
  Leaf,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
} from "lucide-react";
import type { MenuItem } from "@/types";
import { CATEGORY_EMOJI, MENU_CATEGORIES } from "@/lib/types";
import { fetchFeaturedMenu } from "@/lib/api";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function HomePage() {
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="bg-[#fffaf3]">
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2000&q=80"
            alt="Wood-fired pizza fresh from the oven"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2b120c]/95 via-[#3b1c12]/80 to-[#3b1c12]/35" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col justify-center gap-8 px-4 py-24 sm:px-6 lg:min-h-[560px] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200 ring-1 ring-white/20">
              <Flame className="size-3.5" /> Baked fresh, delivered hot
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hot &amp; Fresh Pizza{" "}
              <span className="text-[#f0a23c]">Delivered</span> to Your Door
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-amber-50/90 sm:text-lg">
              Discover local pizza shops, explore handcrafted menus, and satisfy every craving —
              from classic Margherita to loaded meat lovers.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-[#c8402b] hover:bg-[#ad3521]">
                <Link href="/menu">
                  Explore Pizza Menu <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href="/sign-up">Become a Vendor</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-amber-50/80">
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-[#f0a23c] text-[#f0a23c]" /> 4.8 average rating
              </span>
              <span className="flex items-center gap-1.5">
                <Bike className="size-4 text-[#f0a23c]" /> 30-min delivery
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#f0a23c]" /> Secure checkout
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────── Featured menu items ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b]">
              Fresh from the oven
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#3b1c12] sm:text-4xl">
              Featured Pizzas
            </h2>
            <p className="max-w-xl text-[#7a5c4d]">
              Handpicked dishes from our top-rated local restaurants.
            </p>
          </div>
          <Button asChild variant="outline" className="border-[#d9b99e] text-[#3b1c12]">
            <Link href="/menu">
              View full menu <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-xl border bg-white p-4">
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <Button onClick={loadFeatured} className="mt-4 bg-[#c8402b] hover:bg-[#ad3521]">
              Try again
            </Button>
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e3cdb6] bg-white p-12 text-center">
            <ChefHat className="mx-auto mb-3 size-10 text-[#c8402b]" />
            <h3 className="text-lg font-bold text-[#3b1c12]">No pizzas on the menu yet</h3>
            <p className="mt-1 text-sm text-[#7a5c4d]">
              Vendors are still baking. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────── Categories ─────────────────── */}
      <section className="border-y border-[#f0e2d2] bg-white/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b]">
              Something for everyone
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#3b1c12] sm:text-4xl">
              Explore by Category
            </h2>
            <p className="mx-auto max-w-xl text-[#7a5c4d]">
              From timeless classics to bold gourmet creations — find your perfect slice.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {MENU_CATEGORIES.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <Link
                  href={`/menu?category=${encodeURIComponent(category)}`}
                  className="group flex h-full flex-col items-center gap-3 rounded-xl border border-[#efe1d0] bg-[#fffaf3] p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[#c8402b]/40 hover:shadow-md"
                >
                  <span className="grid size-14 place-items-center rounded-full bg-[#fdeade] text-2xl transition-transform group-hover:scale-110">
                    {CATEGORY_EMOJI[category]}
                  </span>
                  <span className="text-sm font-semibold leading-tight text-[#3b1c12]">
                    {category}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── Why choose PizzaHub ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-10 space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b]">
            The PizzaHub difference
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#3b1c12] sm:text-4xl">
            Why Choose PizzaHub?
          </h2>
          <p className="mx-auto max-w-2xl text-[#7a5c4d]">
            We connect pizza lovers with trusted local kitchens — no guesswork, no cold slices.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ChefHat,
              title: "Local Artisan Kitchens",
              text: "Every vendor is verified, and every menu item is reviewed by our team before it goes live.",
            },
            {
              icon: Timer,
              title: "30-Minute Delivery",
              text: "Smart routing keeps your pizza hot — or your next order is on us.",
            },
            {
              icon: Leaf,
              title: "Fresh Ingredients",
              text: "Dough made daily, locally sourced produce, and zero shortcuts on quality.",
            },
            {
              icon: ShieldCheck,
              title: "Safe & Secure",
              text: "Role-based accounts, verified payments, and transparent order tracking.",
            },
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Card className="h-full border-[#efe1d0] bg-white">
                <CardContent className="space-y-3 p-6">
                  <span className="grid size-12 place-items-center rounded-xl bg-[#fdeade] text-[#c8402b]">
                    <benefit.icon className="size-6" />
                  </span>
                  <h3 className="text-lg font-bold text-[#3b1c12]">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-[#7a5c4d]">{benefit.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────── How it works ─────────────────── */}
      <section className="border-y border-[#f0e2d2] bg-[#3b1c12] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f0a23c]">
              Simple by design
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              How PizzaHub Works
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse & Discover",
                text: "Search local pizza shops by name, category, and area. Compare menus in seconds.",
              },
              {
                step: "02",
                title: "Order in Two Clicks",
                text: "Pick your delivery date and address, add special instructions, and submit your order.",
              },
              {
                step: "03",
                title: "Track & Enjoy",
                text: "Watch your order get accepted, freshly prepared, and delivered to your door.",
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="relative rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <span className="text-4xl font-extrabold text-[#f0a23c]/40">{step.step}</span>
                <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-50/75">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── Testimonials ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-10 space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b]">
            Loved by locals
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#3b1c12] sm:text-4xl">
            What Pizza Lovers Say
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Amelia Carter",
              role: "Customer",
              quote:
                "The ordering flow is effortless and my pizza arrived piping hot in 25 minutes. PizzaHub is my Friday ritual now.",
            },
            {
              name: "Marco Rossi",
              role: "Vendor · Napoli Wood-Fired",
              quote:
                "Going Premium put my pizzeria on the homepage. Orders tripled in the first month — the dashboard makes it easy.",
            },
            {
              name: "Daniel Kim",
              role: "Customer",
              quote:
                "Finally a platform that respects local restaurants. Clear menus, real reviews, and no hidden fees.",
            },
          ].map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
            >
              <Card className="h-full border-[#efe1d0] bg-white">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <Quote className="size-7 text-[#f0a23c]" />
                  <p className="flex-1 text-sm leading-relaxed text-[#5d4032]">{t.quote}</p>
                  <div className="flex items-center gap-3 border-t border-[#f3e6d8] pt-4">
                    <span className="grid size-10 place-items-center rounded-full bg-[#fdeade] font-bold text-[#c8402b]">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#3b1c12]">{t.name}</p>
                      <p className="text-xs text-[#a18573]">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-[#f0a23c] text-[#f0a23c]" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────── Vendor CTA ─────────────────── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8f1d14] to-[#c8402b] px-6 py-12 text-white sm:px-12"
          >
            <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="size-3.5" /> For restaurant owners
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Turn your oven into an online storefront
                </h2>
                <p className="text-sm text-amber-50/90">
                  Join PizzaHub free, publish up to 3 dishes, and upgrade to Premium for unlimited
                  menu items, a badge, and homepage placement.
                </p>
              </div>
              <Button asChild size="lg" className="bg-white text-[#8f1d14] hover:bg-amber-50">
                <Link href="/sign-up">
                  Start Selling <BadgeCheck className="size-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
