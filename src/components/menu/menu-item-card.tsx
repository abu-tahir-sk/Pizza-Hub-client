"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Star, Store } from "lucide-react";
import type { MenuItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/favorites-context";
import { cn, formatPrice } from "@/lib/utils";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item._id);
  const vendor = typeof item.vendorId === "object" ? item.vendorId : null;
  const vendorName = vendor?.businessName || vendor?.name || "PizzaHub Kitchen";
  const isPremium = vendor?.subscriptionPlan === "premium";
  const image = item.images?.[0] ?? "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c8402b]/40 hover:shadow-xl">
      {/* Top Image & Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={item.itemName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
          <Badge className="bg-background/95 text-foreground border border-border/80 shadow-xs font-semibold backdrop-blur-xs">
            {item.category}
          </Badge>
          {isPremium ? (
            <Badge className="bg-[#c8402b] text-white shadow-xs font-bold flex items-center gap-1">
              <Star className="size-3 fill-current" /> Premium
            </Badge>
          ) : null}
        </div>

        {/* Favorite Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleFavorite(item._id, item.itemName)}
          aria-label={
            favorite
              ? `Remove ${item.itemName} from favorites`
              : `Save ${item.itemName} to favorites`
          }
          aria-pressed={favorite}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-background/90 text-[#c8402b] border border-border/80 shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-95"
        >
          <Heart className={cn("size-4 transition-colors", favorite && "fill-[#c8402b]")} />
        </button>

        {/* Rating chip on image */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-xs">
          <Star className="size-3 fill-[#f0a23c] text-[#f0a23c]" />
          <span>4.9</span>
          <span className="text-white/70 font-normal">(42+)</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-lg font-bold text-foreground group-hover:text-[#c8402b] transition-colors">
              {item.itemName}
            </h3>
            <span className="shrink-0 text-xl font-extrabold text-[#c8402b]">
              {formatPrice(item.price)}
            </span>
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>

        <div className="space-y-3 border-t border-border/60 pt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5 truncate max-w-[55%]">
              <Store className="size-3.5 text-[#c8402b] shrink-0" />
              <span className="truncate font-medium">{vendorName}</span>
            </p>
            <p className="flex items-center gap-1 text-[11px] shrink-0">
              <MapPin className="size-3 text-muted-foreground shrink-0" />
              <span>{item.location}</span>
            </p>
          </div>

          <Button asChild className="w-full bg-[#c8402b] font-semibold text-white shadow-xs hover:bg-[#ad3521]">
            <Link href={`/menu/${item._id}`}>
              View Details &amp; Order <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
