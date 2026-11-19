"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star, Store } from "lucide-react";
import type { MenuItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/favorites-context";
import { cn, formatPrice } from "@/lib/utils";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item._id);
  const vendor = typeof item.vendorId === "object" ? item.vendorId : null;
  const vendorName = vendor?.businessName || vendor?.name || "PizzaHub Vendor";
  const isPremium = vendor?.subscriptionPlan === "premium";
  const image = item.images?.[0] ?? "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#efe1d0] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-[#f7ecdf]">
        <Image
          src={image}
          alt={item.itemName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge className="bg-white/95 text-[#3b1c12] shadow-sm">{item.category}</Badge>
          {isPremium ? (
            <Badge className="bg-[#c8402b] text-white shadow-sm">
              <Star className="size-3 fill-current" /> Premium
            </Badge>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(item._id, item.itemName)}
          aria-label={
            favorite
              ? `Remove ${item.itemName} from favorites`
              : `Save ${item.itemName} to favorites`
          }
          aria-pressed={favorite}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/95 text-[#c8402b] shadow-sm transition-colors hover:bg-white"
        >
          <Heart className={cn("size-4", favorite && "fill-current")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-bold text-[#3b1c12]">{item.itemName}</h3>
          <span className="shrink-0 text-lg font-extrabold text-[#c8402b]">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-[#7a5c4d]">{item.description}</p>

        <div className="mt-auto space-y-2 pt-2 text-xs text-[#8a6a58]">
          <p className="flex items-center gap-1.5">
            <Store className="size-3.5" /> {vendorName}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {item.location}
          </p>
          <Button asChild className="mt-2 w-full bg-[#c8402b] hover:bg-[#ad3521]">
            <Link href={`/menu/${item._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
