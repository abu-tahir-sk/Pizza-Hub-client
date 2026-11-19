"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  ChefHat,
  Clock,
  Compass,
  Flame,
  Heart,
  Leaf,
  Percent,
  Pizza,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import type { MenuItem } from "@/types";
import { CATEGORY_EMOJI, MENU_CATEGORIES } from "@/lib/types";
import { fetchFeaturedMenu } from "@/lib/api";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const POPULAR_COMBOS = [
  {
    id: "combo-1",
    title: "Family Weekend Feast",
    subtitle: "2 Large Pizzas + Garlic Bread + 2L Soda",
    discount: "Save 25%",
    price: "$34.99",
    originalPrice: "$46.99",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",
    badge: "Most Popular",
    tag: "Serves 4-5",
  },
  {
    id: "combo-2",
    title: "Double Delight Duo",
    subtitle: "1 Classic Margherita + 1 Spicy Pepperoni",
    discount: "Save 20%",
    price: "$24.99",
    originalPrice: "$31.99",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=700&q=80",
    badge: "Chef's Choice",
    tag: "Serves 2-3",
  },
  {
    id: "combo-3",
    title: "Game Night Meat Lovers",
    subtitle: "1 BBQ Chicken + Loaded Sausage + Crispy Wings",
    discount: "Save 18%",
    price: "$28.50",
    originalPrice: "$34.99",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80",
    badge: "Best Value",
    tag: "Serves 3-4",
  },
];

const CRUST_GUIDES = [
  {
    title: "Neapolitan Crust",
    desc: "Soft, pillowy & blistered in a 900°F wood-fired oven. Fermented 48 hours for delicate airy bubbles.",
    flavour: "Traditional Italian",
    icon: Flame,
  },
  {
    title: "New York Foldable",
    desc: "Crispy outer rim with a pliable, chewy centre engineered to be folded down the middle effortlessly.",
    flavour: "Street Classic",
    icon: Compass,
  },
  {
    title: "Detroit Pan Crust",
    desc: "Thick, focaccia-like square crust baked in steel pans with deeply caramelised Wisconsin cheddar edges.",
    flavour: "Crispy Cheese Edge",
    icon: Sparkles,
  },
  {
    title: "Gluten-Free Herb Crust",
    desc: "Crafted with cauliflower flour, cold-pressed olive oil, and rosemary for zero digestive compromise.",
    flavour: "Health-Conscious",
    icon: Leaf,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/menu");
    }
  }

  return (
    <div className="bg-background text-foreground transition-colors">
      {/* ───────────────────────── 1. ThemeForest-Grade Hero ───────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background photo & rich warm vignette */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2200&q=85"
            alt="Wood-fired pizza fresh from the brick oven"
            fill
            priority
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b0804]/95 via-[#2b120c]/85 to-[#3b1c12]/45" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#1b0804]/40 to-[#1b0804]/80" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-28 lg:min-h-[640px] lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6 lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 ring-1 ring-white/20 backdrop-blur-md">
                <Flame className="size-3.5 text-[#f0a23c] animate-pulse" />
                <span>Wood-Fired &amp; Oven-Fresh Delivery</span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Hot &amp; Fresh Pizza{" "}
                <span className="text-[#f0a23c]">Delivered</span> to Your Door
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-amber-50/90 sm:text-lg">
                Discover independent local pizzerias, explore hand-tossed artisan doughs, and order in two clicks — guaranteed hot and fresh in under 30 minutes.
              </p>

              {/* Fast Pizza Search Bar */}
              <form
                onSubmit={handleQuickSearch}
                className="flex w-full max-w-lg items-center rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/25 backdrop-blur-md shadow-2xl transition-all focus-within:ring-[#f0a23c] focus-within:bg-white/15"
              >
                <div className="flex flex-1 items-center gap-2.5 px-3">
                  <Search className="size-5 text-amber-200" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pizza, topping, or restaurant..."
                    className="w-full bg-transparent text-sm font-medium text-white placeholder-amber-200/60 focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="default"
                  className="rounded-xl bg-[#c8402b] px-5 font-semibold text-white shadow-md hover:bg-[#ad3521]"
                >
                  Find Pizza
                </Button>
              </form>

              {/* Primary Call To Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="h-12 bg-[#c8402b] px-6 text-base font-bold shadow-lg hover:bg-[#ad3521]">
                  <Link href="/menu">
                    Explore Pizza Menu <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/30 bg-white/5 px-6 text-base font-bold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
                >
                  <Link href="/sign-up">Become a Vendor</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs font-semibold text-amber-100/90">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-[#f0a23c] text-[#f0a23c]" /> 4.9 Average Rating (1,200+ Reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Bike className="size-4 text-[#f0a23c]" /> 30-Min Hot Bag Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-[#f0a23c]" /> Verified Pizzerias Only
                </span>
              </div>
            </motion.div>

            {/* Hero Right Visuals / Floating Promo Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden lg:col-span-5 lg:block"
            >
              <div className="relative mx-auto max-w-sm rounded-3xl border border-white/15 bg-gradient-to-b from-white/15 to-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-5">
                <div className="relative h-56 w-full overflow-hidden rounded-2xl shadow-inner">
                  <Image
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
                    alt="Chef's Special Pizza"
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-[#c8402b] text-white font-bold shadow-md">
                    🔥 Chef&apos;s Signature
                  </Badge>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    30 Min Express
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Truffle Wild Mushroom</h3>
                    <span className="text-xl font-extrabold text-[#f0a23c]">$18.99</span>
                  </div>
                  <p className="text-xs text-amber-100/80 leading-relaxed">
                    Slow-fermented dough, Fior di latte mozzarella, roasted wild portobello, and white truffle glaze.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-full bg-[#f0a23c] text-xs font-bold text-[#2b120c]">
                      🍕
                    </span>
                    <span className="text-xs font-semibold text-white">Napoli Wood-Fired</span>
                  </div>
                  <Button asChild size="sm" className="bg-[#c8402b] text-xs font-bold hover:bg-[#ad3521]">
                    <Link href="/menu">Order Now</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────── 2. Categories Section (ThemeForest Style) ─────────────────── */}
      <section className="border-b border-border bg-muted/40 py-16 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b]">
              Handcrafted Crusts &amp; Recipes
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Explore by Pizza Category
            </h2>
            <p className="mx-auto max-w-xl text-sm sm:text-base text-muted-foreground">
              From timeless Margherita to bold specialty creations — satisfy your taste buds.
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
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#c8402b] hover:shadow-lg"
                >
                  <span className="grid size-16 place-items-center rounded-2xl bg-orange-500/10 text-3xl transition-transform group-hover:scale-110 dark:bg-stone-800">
                    {CATEGORY_EMOJI[category]}
                  </span>
                  <span className="text-sm font-bold leading-tight text-foreground group-hover:text-[#c8402b] transition-colors">
                    {category}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 3. Featured Menu Items (Dynamic Live) ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b]">
              Freshly approved pizzas
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Featured Menu Items
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Handpicked customer favourites from verified top-rated local kitchens.
            </p>
          </div>
          <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted font-semibold">
            <Link href="/menu">
              View full menu <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-border bg-card p-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded-lg" />
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
            <h3 className="text-lg font-bold text-foreground">No pizzas on the menu yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Vendors are still baking. Check back soon or register as a vendor!
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

      {/* ─────────────────── 4. Popular Pizza Combos & Daily Deals (Extra Section) ─────────────────── */}
      <section className="border-y border-border bg-muted/40 py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 space-y-2 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c8402b]">
              <Percent className="size-3.5" /> Best Value Bundles
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Popular Pizza Combos &amp; Deals
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Handcrafted multi-pizza combo bundles designed for friends, family, and game night cravings.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {POPULAR_COMBOS.map((combo, index) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="group h-full overflow-hidden rounded-2xl border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <Image
                      src={combo.image}
                      alt={combo.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute top-3 left-3 bg-[#c8402b] text-white font-bold shadow-md">
                      {combo.discount}
                    </Badge>
                    <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur-xs">
                      {combo.tag}
                    </span>
                  </div>
                  <CardContent className="space-y-4 p-5">
                    <div>
                      <span className="text-xs font-bold text-[#f0a23c] uppercase tracking-wider">
                        {combo.badge}
                      </span>
                      <h3 className="text-xl font-bold text-foreground mt-1">{combo.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{combo.subtitle}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <span className="text-xl font-extrabold text-[#c8402b]">{combo.price}</span>
                        <span className="ml-2 text-xs text-muted-foreground line-through">{combo.originalPrice}</span>
                      </div>
                      <Button asChild size="sm" className="bg-[#c8402b] font-semibold hover:bg-[#ad3521]">
                        <Link href="/menu">Order Combo</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 5. Why Choose PizzaHub (Required Section) ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-12 space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b]">
            The PizzaHub Standard
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Why Choose PizzaHub?
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We bridge the gap between discerning foodies and authentic local pizzerias with zero compromises on temperature or taste.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ChefHat,
              title: "Verified Artisan Kitchens",
              text: "Every vendor profile is vetted, and every menu item is reviewed by administrators before going live.",
            },
            {
              icon: Timer,
              title: "30-Minute Hot Guarantee",
              text: "Insulated thermal delivery bags keep the crust crisp and the cheese bubbling until it arrives.",
            },
            {
              icon: Leaf,
              title: "100% Fresh Daily Dough",
              text: "No frozen industrial crusts. 48-hour slow fermentation with unbleached Italian flour.",
            },
            {
              icon: ShieldCheck,
              title: "Zero Hidden Platform Fees",
              text: "Transparent pricing, direct vendor payouts via Stripe, and verified customer reviews.",
            },
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Card className="h-full rounded-2xl border-border bg-card transition-all hover:border-[#c8402b]/40 hover:shadow-md">
                <CardContent className="space-y-3 p-6">
                  <span className="grid size-12 place-items-center rounded-xl bg-orange-500/10 text-[#c8402b] dark:bg-orange-950/40 dark:text-orange-400">
                    <benefit.icon className="size-6" />
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{benefit.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────── 6. How PizzaHub Works (Extra Section) ─────────────────── */}
      <section className="border-y border-border bg-muted/40 py-20 text-foreground transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b] dark:text-[#f0a23c]">
              Effortless ordering
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              How PizzaHub Works
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              From oven to your dining table in three simple steps.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Search,
                title: "Browse & Discover",
                text: "Explore local pizza shops by name, crust type, and neighborhood. Filter by vegetarian, meat, or specialty.",
              },
              {
                step: "02",
                icon: UtensilsCrossed,
                title: "Select & Submit Order",
                text: "Choose your delivery date, address, and special crust requests. Your vendor receives the ticket instantly.",
              },
              {
                step: "03",
                icon: Bike,
                title: "Track & Savor",
                text: "Follow the live order timeline from prep to delivery. Enjoy bubbling hot slices at your doorstep.",
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="relative rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:border-[#c8402b]/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-extrabold text-[#c8402b] dark:text-[#f0a23c]">{step.step}</span>
                  <span className="grid size-10 place-items-center rounded-xl bg-orange-500/10 text-[#c8402b]">
                    <step.icon className="size-5" />
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 7. Crust & Topping Guide (Artisan Foodie Section) ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-12 space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b]">
            Artisan Pizza Craft
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Pizza Lovers&apos; Crust Guide
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Every pizza begins with the dough. Discover the distinct characteristics of the styles baked on PizzaHub.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CRUST_GUIDES.map((guide, index) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Card className="h-full rounded-2xl border-border bg-card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-[#f0a23c]">
                    <guide.icon className="size-5" />
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-[#c8402b] border-[#c8402b]/30">
                    {guide.flavour}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-foreground">{guide.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{guide.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────── 8. Testimonials Section ─────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8402b]">
              Loved by 10,000+ Foodies
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              What Pizza Lovers Say
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Hear directly from our community of passionate pizza fans and restaurant partners.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Amelia Carter",
                role: "Customer · Verified Foodie",
                quote:
                  "The ordering flow is effortless and my pizza arrived piping hot in 22 minutes. The wood-fired crust had that perfect blistered char. PizzaHub is my Friday family ritual!",
              },
              {
                name: "Marco Rossi",
                role: "Vendor · Napoli Wood-Fired",
                quote:
                  "Upgrading to the Premium subscription gave our pizzeria prime homepage placement. Our orders doubled in weeks, and the vendor dashboard makes ticket fulfillment a breeze.",
              },
              {
                name: "Daniel Kim",
                role: "Customer · Pizza Enthusiast",
                quote:
                  "Finally a platform that champions genuine independent local pizzerias! Clear ingredient descriptions, verified reviews, and no frustrating hidden delivery fees.",
              },
            ].map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <Card className="h-full rounded-2xl border-border bg-card shadow-xs">
                  <CardContent className="flex h-full flex-col justify-between p-6 space-y-4">
                    <Quote className="size-8 text-[#f0a23c]" />
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 border-t border-border pt-4">
                      <span className="grid size-10 place-items-center rounded-full bg-[#c8402b] font-bold text-white">
                        {t.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.role}</p>
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
        </div>
      </section>

      {/* ─────────────────── 9. Vendor Call To Action ─────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7a150d] via-[#8f1d14] to-[#c8402b] px-6 py-14 text-white sm:px-12 shadow-2xl"
          >
            <div className="absolute top-0 right-0 -mt-12 -mr-12 size-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  <Sparkles className="size-3.5 text-amber-300" /> For Local Restaurant Owners
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight">
                  Turn your oven into a thriving digital storefront.
                </h2>
                <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
                  Join PizzaHub free to publish up to 3 dishes. Upgrade to Premium anytime for unlimited items, a verified badge, and featured placement on the homepage.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button asChild size="lg" className="h-12 bg-white px-7 text-base font-bold text-[#8f1d14] shadow-lg hover:bg-amber-50">
                  <Link href="/sign-up">
                    Start Selling Free <BadgeCheck className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-white/30 bg-white/10 px-6 text-base font-bold text-white hover:bg-white/20 hover:text-white">
                  <Link href="/menu">Explore Platform</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
