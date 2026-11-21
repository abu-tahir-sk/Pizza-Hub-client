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
          expand={true}
          theme="system"
          className="z-[99999]"
          toastOptions={{
            style: {
              fontFamily: "inherit",
              fontSize: "13px",
            },
          }}
        />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
