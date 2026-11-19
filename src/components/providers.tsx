"use client";

import { ThemeProvider } from "@/context/theme-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ style: { fontFamily: "inherit" } }}
        />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
