"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, MapPin, ShoppingCart, Star, Store } from "lucide-react";
import type { MenuItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/favorites-context";
import { cn, formatPrice } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  index?: number;
  priority?: boolean;
}

export function MenuItemCard({ item, index = 0, priority = false }: MenuItemCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item._id);
  const vendor = typeof item.vendorId === "object" ? item.vendorId : null;
  const vendorName = vendor?.businessName || vendor?.name || "PizzaHub Kitchen";
  const isPremium = vendor?.subscriptionPlan === "premium";
  const image =
    item.images?.[0] ??
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";

  const rating = item.rating ?? 5.0;
  const ratingCount = item.ratingCount ?? 42;

  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-border/70 bg-card p-3 sm:p-3.5 text-card-foreground shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-[#c8402b]/40 hover:shadow-[0_22px_45px_-12px_rgba(200,64,43,0.18)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_22px_45px_-12px_rgba(200,64,43,0.25)]"
    >
      {/* ─── Top Framed Image Container (Styled like the reference image) ─── */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-muted">
        <Link href={`/menu/${item._id}`} className="block h-full w-full">
          <Image
            src={image}
            alt={item.itemName}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20 pointer-events-none" />

          {/* Shimmer light sweep beam on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        </Link>

        {/* Floating Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5 z-10 pointer-events-none">
          <span className="inline-flex items-center rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-bold text-foreground uppercase tracking-wider shadow-sm backdrop-blur-md border border-border/60">
            {item.category}
          </span>
          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#c8402b] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
              <Star className="size-2.5 fill-current" /> Premium
            </span>
          )}
        </div>

        {/* Favorite Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(item._id, item.itemName);
          }}
          aria-label={
            favorite
              ? `Remove ${item.itemName} from favorites`
              : `Save ${item.itemName} to favorites`
          }
          aria-pressed={favorite}
          className="absolute right-3 top-3 z-10 grid size-[34px] place-items-center rounded-full bg-background/90 text-[#c8402b] border border-border/70 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-115 active:scale-90"
        >
          <Heart
            className={cn(
              "size-4 transition-all duration-300",
              favorite ? "fill-[#c8402b] scale-110" : "hover:text-[#c8402b]"
            )}
          />
        </button>
      </div>

      {/* ─── Card Body ─── */}
      <div className="flex flex-1 flex-col justify-between pt-3.5 pb-1 px-1 sm:px-1.5 space-y-3">
        <div className="space-y-1.5">
          {/* Title in bold uppercase matching reference */}
          <Link href={`/menu/${item._id}`} className="block group/title">
            <h3 className="line-clamp-1 text-base sm:text-lg font-black tracking-wide uppercase text-foreground transition-colors duration-200 group-hover:text-[#c8402b]">
              {item.itemName}
            </h3>
          </Link>

          {/* 5 Golden Stars (Exactly matching reference picture) */}
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="size-3.5 fill-amber-500 text-amber-500 transition-transform duration-300 group-hover:scale-115"
                style={{ transitionDelay: `${i * 35}ms` }}
              />
            ))}
            <span className="text-[11px] font-bold text-muted-foreground ml-1.5">
              {rating.toFixed(1)} <span className="font-normal opacity-75">({ratingCount})</span>
            </span>
          </div>

          {/* Short description */}
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground min-h-[2rem]">
            {item.description}
          </p>
        </div>

        {/* Vendor & Location info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <p className="flex items-center gap-1.5 truncate max-w-[58%]">
            <Store className="size-3.5 text-[#c8402b] shrink-0" />
            <span className="truncate font-medium">{vendorName}</span>
          </p>
          <p className="flex items-center gap-1 text-[11px] shrink-0">
            <MapPin className="size-3 text-muted-foreground shrink-0" />
            <span>{item.location}</span>
          </p>
        </div>

        {/* ─── Bottom Action Row (Matching Reference: "ADD TO CART" pill on Left, "$XX.XX USD" on Right) ─── */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {/* "ADD TO CART" Pill Button */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-[#c8402b] hover:text-white hover:border-[#c8402b] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-foreground transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-[#c8402b]/25 active:scale-95 group/btn"
          >
            <Link href={`/menu/${item._id}`} className="flex items-center gap-1.5">
              <ShoppingCart className="size-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
              <span>Add to Cart</span>
            </Link>
          </Button>

          {/* Price: e.g. "$24.00 USD" matching "$66.00 USD" in image */}
          <div className="flex items-baseline gap-1 text-right">
            <span className="text-base sm:text-lg font-black tracking-tight text-foreground transition-colors duration-200 group-hover:text-[#c8402b]">
              {formatPrice(item.price)}
            </span>
            <span className="text-[11px] font-extrabold text-muted-foreground uppercase">
              USD
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
