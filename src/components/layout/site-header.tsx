"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Pizza,
  Settings,
  ShoppingBag,
  Sun,
  UserPlus,
  UtensilsCrossed,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { clearToken, getSessionUser } from "@/lib/api";
import { dashboardPath, type AppUser } from "@/lib/types";
import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { BrandLogo } from "@/components/layout/brand-logo";

export function SiteHeader() {
  const { data: session, isPending, refetch } = useSession();
  const [activeUser, setActiveUser] = useState<AppUser | undefined>(session?.user as unknown as AppUser | undefined);
  const user = activeUser;
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (session?.user) {
      setActiveUser(session.user as unknown as AppUser);
    } else {
      void getSessionUser().then((u) => {
        if (u) setActiveUser(u as unknown as AppUser);
        else setActiveUser(undefined);
      });
    }
  }, [session, pathname]);

  // Keep session state immediately updated when route or auth changes
  useEffect(() => {
    void refetch();
  }, [pathname, refetch]);

  useEffect(() => {
    const handleAuthEvent = () => {
      void refetch();
      void getSessionUser().then((u) => {
        if (u) setActiveUser(u as unknown as AppUser);
        else setActiveUser(undefined);
      });
    };
    window.addEventListener("pizzahub-auth-change", handleAuthEvent);
    window.addEventListener("storage", handleAuthEvent);
    window.addEventListener("focus", handleAuthEvent);
    return () => {
      window.removeEventListener("pizzahub-auth-change", handleAuthEvent);
      window.removeEventListener("storage", handleAuthEvent);
      window.removeEventListener("focus", handleAuthEvent);
    };
  }, [refetch]);

  async function handleSignOut() {
    try {
      await signOut();
      clearToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("pizzahub-auth-change"));
      }
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  }

  const isHomeActive = pathname === "/";
  const isMenuActive = pathname === "/menu" || pathname.startsWith("/menu/");
  const isDashboardActive = pathname.startsWith("/dashboard");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-xs transition-colors">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo / Name: PizzaHub */}
          <BrandLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 lg:flex">
            {/* 1. Home */}
            <Link
              href="/"
              className={cn(
                "relative py-1 text-sm font-bold transition-all",
                isHomeActive
                  ? "text-foreground after:content-[''] after:absolute after:-bottom-2.5 after:left-1 after:right-1 after:h-[2px] after:bg-[#f43f5e] after:rounded-full"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Home</span>
            </Link>

            {/* 2. Browse Menu */}
            <Link
              href="/menu"
              className={cn(
                "relative py-1 text-sm font-bold transition-all",
                isMenuActive
                  ? "text-foreground after:content-[''] after:absolute after:-bottom-2.5 after:left-1 after:right-1 after:h-[2px] after:bg-[#f43f5e] after:rounded-full"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Browse Menu</span>
            </Link>
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Auth Dependent Controls */}
            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* 1. Theme Appearance Toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle appearance"
                  className="size-9 rounded-full border border-border bg-muted/50 text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                >
                  {theme === "dark" ? (
                    <Sun className="size-4 text-amber-400" />
                  ) : (
                    <Moon className="size-4 text-foreground" />
                  )}
                </button>

                {/* 2. User Avatar Pill Dropdown (Includes Dashboard, Profile Settings, Logout) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full border border-border bg-card pl-1.5 pr-3 py-1 text-left transition-all hover:border-border/80 focus:outline-none cursor-pointer">
                      <span className="grid size-7 place-items-center rounded-full bg-gradient-to-tr from-[#e11d48] to-[#f43f5e] text-white text-xs font-bold">
                        {initials(user.name)}
                      </span>
                      <span className="max-w-28 truncate text-xs font-bold text-foreground">
                        {user.name?.split(" ")[0]}
                      </span>
                      <ChevronDown className="size-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border-border bg-popover text-popover-foreground">
                    <DropdownMenuLabel className="font-normal px-3 py-2 bg-muted rounded-xl mb-1">
                      <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground mt-0.5">{user.email}</p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-1 bg-border" />

                    <DropdownMenuItem asChild className="rounded-xl font-semibold cursor-pointer py-2.5 hover:bg-muted text-foreground">
                      <Link href={dashboardPath(user.role)}>
                        <LayoutDashboard className="size-4 mr-2 text-[#f43f5e]" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-xl font-semibold cursor-pointer py-2.5 hover:bg-muted text-foreground">
                      <Link href="/profile">
                        <Settings className="size-4 mr-2 text-muted-foreground" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-border" />
                    <DropdownMenuItem
                      onSelect={handleSignOut}
                      className="rounded-xl font-bold cursor-pointer py-2.5 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/40 focus:text-red-600 dark:focus:text-red-300"
                    >
                      <LogOut className="size-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              /* Public / Logged Out: Sign In & Sign Up Buttons */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle appearance"
                  className="size-9 rounded-full border border-border bg-muted/50 text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer mr-1"
                >
                  {theme === "dark" ? (
                    <Sun className="size-4 text-amber-400" />
                  ) : (
                    <Moon className="size-4 text-foreground" />
                  )}
                </button>
                <Button
                  asChild
                  className="rounded-full bg-gradient-to-r from-[#f43f5e] to-[#e11d48] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(244,63,94,0.35)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] cursor-pointer"
                >
                  <Link href="/sign-in">
                    <LogIn className="size-3.5 mr-1.5" />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="hidden rounded-full border-border bg-muted/70 px-4 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted sm:inline-flex cursor-pointer"
                >
                  <Link href="/sign-up">
                    <UserPlus className="size-3.5 mr-1.5" />
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-3 pt-2 px-4 lg:hidden pointer-events-none bg-gradient-to-t from-background/95 via-background/80 to-transparent">
        <nav className="pointer-events-auto flex items-center justify-around gap-1 rounded-2xl border border-border bg-background/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl w-full max-w-md">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
              pathname === "/"
                ? "text-[#c8402b] bg-[#c8402b]/10 font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Home className="size-5" />
            <span className="text-[10px] font-semibold leading-none">Home</span>
          </Link>

          {/* Browse Menu */}
          <Link
            href="/menu"
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all",
              pathname.startsWith("/menu")
                ? "text-[#c8402b] bg-[#c8402b]/10 font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UtensilsCrossed className="size-5" />
            <span className="text-[10px] font-semibold leading-none">Menu</span>
          </Link>

          {/* If Logged In: Role-relevant Dashboard, If Logged Out: Sign In */}
          {user ? (
            <Link
              href={dashboardPath(user.role)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all",
                pathname.startsWith("/dashboard")
                  ? "text-[#c8402b] bg-[#c8402b]/10 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutDashboard className="size-5" />
              <span className="text-[10px] font-semibold leading-none">Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all",
                pathname === "/sign-in"
                  ? "text-[#c8402b] bg-[#c8402b]/10 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LogIn className="size-5" />
              <span className="text-[10px] font-semibold leading-none">Sign In</span>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
