"use client";

import React from "react";
import Link from "next/link";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useFavorites } from "@/context/favorites-context";
import { MapPin, Star, Heart, Flame, Award, ArrowRight } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item._id || item.id || "");

  const vendorName =
    typeof item.vendorId === "object"
      ? item.vendorId?.businessName || item.vendorId?.name || "Artisan Kitchen"
      : "Artisan Kitchen";

  const isPremiumVendor =
    typeof item.vendorId === "object" && item.vendorId?.subscriptionPlan === "premium";

  const imageSrc =
    item.images && item.images.length > 0
      ? item.images[0]
      : "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="group flex flex-col h-full rounded-2xl border border-stone-200/80 bg-white dark:border-stone-800/80 dark:bg-stone-900 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image container with aspect ratio */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={imageSrc}
          alt={item.itemName}
          className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="rounded-full bg-stone-950/75 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            {item.category}
          </span>
          {isPremiumVendor && (
            <span className="rounded-full bg-gradient-to-r from-amber-500 to-red-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
              <Award className="w-3 h-3" />
              Premium
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(item._id || item.id || "", item.itemName);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-200 ${favorited
              ? "bg-red-600 text-white"
              : "bg-white/80 text-stone-700 hover:bg-white hover:text-red-600 dark:bg-stone-900/80 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-red-400"
            }`}
          title={favorited ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${favorited ? "fill-white" : ""}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-1 text-sm font-extrabold text-red-600 dark:text-red-400 shadow-md">
          {formatPrice(item.price)}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 justify-between">
        <div>
          {/* Vendor and Location */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="font-semibold text-stone-700 dark:text-stone-300 truncate max-w-[170px]">
              {vendorName}
            </span>
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {item.rating || 4.9}
              </span>
              <span className="text-[10px] text-stone-400">
                ({item.ratingCount || 85})
              </span>
            </div>
          </div>

          {/* Item Name */}
          <h3 className="font-bold text-lg text-stone-900 dark:text-white line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {item.itemName}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Area: Location & CTA */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 max-w-[140px] truncate">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <Link
            href={`/menu/${item._id || item.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 text-red-600 px-3.5 py-1.5 text-xs font-bold hover:bg-red-600 hover:text-white dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-sm"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

