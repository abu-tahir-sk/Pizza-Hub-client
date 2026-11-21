"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string, name?: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => { },
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pizzahub_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string, name?: string) => {
    const exists = favorites.includes(id);
    const updated = exists
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(updated);
    try {
      localStorage.setItem("pizzahub_favorites", JSON.stringify(updated));
    } catch {
      // ignore storage failures (e.g. private mode)
    }
    if (exists) {
      toast.info(name ? `Removed ${name} from favorites` : "Removed from favorites");
    } else {
      toast.success(name ? `Saved ${name} to favorites` : "Saved to favorites");
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

