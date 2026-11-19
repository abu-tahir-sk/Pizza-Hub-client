"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { MenuItem } from "@/types";
import { fetchMenuItems } from "@/lib/api";
import { useFavorites } from "@/context/favorites-context";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Wait one tick so the FavoritesProvider can hydrate from localStorage.
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    async function load() {
      if (favorites.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetchMenuItems({ limit: 100 });
        if (!cancelled) {
          setItems(res.items.filter((item) => favorites.includes(item._id)));
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Could not load your favorites. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [ready, favorites]);

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <section className="border-b border-[#f0e2d2] bg-[#3b1c12] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#f0a23c]">
            <Heart className="size-3.5 fill-current" /> Saved for later
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Your Favorites</h1>
          <p className="mt-2 max-w-2xl text-sm text-amber-50/80">
            {favorites.length > 0
              ? `${favorites.length} pizza${favorites.length === 1 ? "" : "s"} saved on this device.`
              : "Tap the heart on any pizza to save it here."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-700">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e3cdb6] bg-white p-14 text-center">
            <Heart className="mx-auto mb-3 size-10 text-[#c8402b]" />
            <h2 className="text-lg font-bold text-[#3b1c12]">
              {favorites.length === 0 ? "No favorites yet" : "Your favorites are no longer available"}
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#7a5c4d]">
              Browse the menu and tap the heart icon on a pizza to save it for next time.
            </p>
            <Button asChild className="mt-5 bg-[#c8402b] hover:bg-[#ad3521]">
              <Link href="/menu">Browse the menu</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
