"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgeDollarSign,
  CreditCard,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Pizza,
  Receipt,
  Settings,
  ShoppingBag,
  Sun,
  UserPlus,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { dashboardPath, type AppUser } from "@/lib/types";
import { useTheme } from "@/context/theme-context";
import { useFavorites } from "@/context/favorites-context";
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

export function SiteHeader() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user as unknown as AppUser | undefined;
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  // Keep session state immediately updated when route or auth changes
  useEffect(() => {
    void refetch();
  }, [pathname, refetch]);

  useEffect(() => {
    const handleAuthEvent = () => {
      void refetch();
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

  // Determine role-specific nav items if logged in
  const getRoleNavItems = () => {
    if (!user) return [];
    if (user.role === "admin") {
      return [
        { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
        { href: "/dashboard/admin/items", label: "Manage Items", icon: UtensilsCrossed },
        { href: "/dashboard/admin/orders", label: "Orders", icon: ShoppingBag },
        { href: "/dashboard/admin/transactions", label: "Transactions", icon: BadgeDollarSign },
      ];
    }
    if (user.role === "vendor") {
      return [
        { href: "/dashboard/vendor/items", label: "Manage Items", icon: UtensilsCrossed },
        { href: "/dashboard/vendor/orders", label: "Orders", icon: ShoppingBag },
        { href: "/dashboard/vendor/subscription", label: "Subscription", icon: CreditCard },
      ];
    }
    // Default: Customer
    return [
      { href: "/dashboard/customer/orders", label: "Orders", icon: ShoppingBag },
      { href: "/favorites", label: "Favorites", icon: Heart },
    ];
  };

  const roleNavs = getRoleNavItems();

  const isHomeActive = pathname === "/";
  const isMenuActive = pathname === "/menu" || pathname.startsWith("/menu/");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md shadow-xs transition-colors">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo / Name: PizzaHub */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#d4432d] text-white shadow-md shadow-[#d4432d]/25 transition-transform group-hover:scale-105">
              <Pizza className="size-6 stroke-[2.2]" />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center text-2xl font-extrabold tracking-tight leading-none">
                <span className="text-neutral-900 dark:text-white">Pizza</span>
                <span className="text-[#f19d38]">Hub</span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase mt-1">
                FRESH & FAST
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Pill Bar */}
          <nav className="hidden items-center gap-1.5 lg:flex bg-[#f4f4f5] dark:bg-neutral-900/90 p-1.5 rounded-2xl border border-neutral-200/70 dark:border-neutral-800">
            {/* Public Link: Home */}
            <Link
              href="/"
              className={cn(
                "group flex min-h-[40px] items-center gap-2 rounded-xl px-3.5 py-1.5 transition-all text-xs sm:text-sm",
                isHomeActive
                  ? "bg-white dark:bg-neutral-800 text-[#d4432d] dark:text-[#ff5c47] font-bold shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-800/50"
              )}
            >
              <Home
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isHomeActive
                    ? "text-[#d4432d] dark:text-[#ff5c47]"
                    : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
                )}
              />
              <span className="font-bold text-sm">Home</span>
            </Link>

            {/* Public Link: Browse Menu */}
            <Link
              href="/menu"
              className={cn(
                "group flex min-h-[40px] items-center gap-2 rounded-xl px-3.5 py-1.5 transition-all text-xs sm:text-sm",
                isMenuActive
                  ? "bg-white dark:bg-neutral-800 text-[#d4432d] dark:text-[#ff5c47] font-bold shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-800/50"
              )}
            >
              <UtensilsCrossed
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isMenuActive
                    ? "text-[#d4432d] dark:text-[#ff5c47]"
                    : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
                )}
              />
              <div className="flex flex-col text-left leading-[1.15]">
                <span className={cn("text-[12px]", isMenuActive ? "font-bold" : "font-semibold")}>
                  Browse
                </span>
                <span className={cn("text-[12px]", isMenuActive ? "font-bold" : "font-semibold")}>
                  Menu
                </span>
              </div>
            </Link>

            {/* Role-Specific Links when Logged In */}
            {user &&
              roleNavs.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const parts = item.label.split(" ");
                const isTwoWords = parts.length === 2;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex min-h-[40px] items-center gap-2 rounded-xl px-3.5 py-1.5 transition-all text-xs sm:text-sm",
                      active
                        ? "bg-white dark:bg-neutral-800 text-[#d4432d] dark:text-[#ff5c47] font-bold shadow-xs"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-800/50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active
                          ? "text-[#d4432d] dark:text-[#ff5c47]"
                          : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
                      )}
                    />
                    {isTwoWords ? (
                      <div className="flex flex-col text-left leading-[1.15]">
                        <span className={cn("text-[12px]", active ? "font-bold" : "font-semibold")}>
                          {parts[0]}
                        </span>
                        <span className={cn("text-[12px]", active ? "font-bold" : "font-semibold")}>
                          {parts[1]}
                        </span>
                      </div>
                    ) : (
                      <span className={cn("text-xs sm:text-sm", active ? "font-bold" : "font-semibold")}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist / Favorites quick button */}
            <Link
              href="/favorites"
              aria-label="View saved favorites"
              className="relative grid size-10 place-items-center rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-[#d4432d] dark:hover:text-[#ff5c47] hover:border-[#d4432d]/40 shadow-xs transition-colors"
            >
              <Heart className="size-4 stroke-[2]" />
              {favorites.length > 0 ? (
                <span className="absolute -right-1 -top-1 grid size-4.5 place-items-center rounded-full bg-[#d4432d] text-[10px] font-black text-white shadow-md animate-pulse">
                  {favorites.length}
                </span>
              ) : null}
            </Link>

            {/* Auth Dependent Controls */}
            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            ) : user ? (
              /* Profile Dropdown: Pill Button with User Name & Avatar */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-full border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-3.5 pr-1.5 py-1.5 text-left transition-all hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm focus:outline-none cursor-pointer">
                    <span className="max-w-36 truncate text-sm font-bold text-neutral-800 dark:text-neutral-100 sm:block">
                      {user.name}
                    </span>
                    <Avatar className="size-8">
                      <AvatarImage src={user.image ?? undefined} alt={user.name} />
                      <AvatarFallback className="bg-[#d4432d] text-white text-xs font-bold">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border-border">
                  <DropdownMenuLabel className="font-normal px-3 py-2 bg-muted/50 rounded-xl mb-1">
                    <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground mt-0.5">{user.email}</p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1" />

                  {/* 1. Dashboard */}
                  <DropdownMenuItem asChild className="rounded-xl font-semibold cursor-pointer py-2.5">
                    <Link href={dashboardPath(user.role)}>
                      <LayoutDashboard className="size-4 mr-2 text-[#d4432d]" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {/* 2. Profile Settings */}
                  <DropdownMenuItem asChild className="rounded-xl font-semibold cursor-pointer py-2.5">
                    <Link href="/profile">
                      <Settings className="size-4 mr-2 text-muted-foreground" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  {/* Favorites on mobile */}
                  <DropdownMenuItem asChild className="rounded-xl font-semibold cursor-pointer py-2.5 sm:hidden">
                    <Link href="/favorites">
                      <Heart className="size-4 mr-2 text-rose-500" />
                      Favorites ({favorites.length})
                    </Link>
                  </DropdownMenuItem>

                  {/* Theme toggle */}
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      toggleTheme();
                    }}
                    className="rounded-xl font-semibold cursor-pointer py-2.5 flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      {theme === "dark" ? (
                        <Sun className="size-4 mr-2 text-amber-400" />
                      ) : (
                        <Moon className="size-4 mr-2 text-muted-foreground" />
                      )}
                      Appearance
                    </span>
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {theme === "dark" ? "Dark" : "Light"}
                    </span>
                  </DropdownMenuItem>

                  {/* 3. Logout */}
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    className="rounded-xl font-bold cursor-pointer py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/40"
                  >
                    <LogOut className="size-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Public / Logged Out: Sign In & Sign Up Buttons */
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  className="font-bold rounded-xl text-neutral-700 dark:text-neutral-200 hover:text-[#d4432d] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm px-3 sm:px-4"
                >
                  <Link href="/sign-in">
                    <LogIn className="size-4 mr-1.5" />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#d4432d] to-[#e65c47] font-bold text-white hover:opacity-95 shadow-md shadow-[#d4432d]/20 rounded-xl px-4 sm:px-5 text-sm"
                >
                  <Link href="/sign-up">
                    <UserPlus className="size-4 mr-1.5" />
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
        <nav className="pointer-events-auto flex items-center justify-around gap-1 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-background/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl w-full max-w-md">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
              pathname === "/"
                ? "text-[#d4432d] bg-[#d4432d]/10 font-bold"
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
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
              pathname.startsWith("/menu")
                ? "text-[#d4432d] bg-[#d4432d]/10 font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UtensilsCrossed className="size-5" />
            <span className="text-[10px] font-semibold leading-none">Menu</span>
          </Link>

          {/* Favorites */}
          <Link
            href="/favorites"
            className={cn(
              "relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
              pathname === "/favorites"
                ? "text-[#d4432d] bg-[#d4432d]/10 font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart className="size-5" />
            <span className="text-[10px] font-semibold leading-none">Favorites</span>
            {favorites.length > 0 ? (
              <span className="absolute right-2 top-1 grid size-4 place-items-center rounded-full bg-[#d4432d] text-[9px] font-black text-white shadow">
                {favorites.length}
              </span>
            ) : null}
          </Link>

          {/* If Logged In: Role-relevant Dashboard, If Logged Out: Sign In */}
          {user ? (
            <Link
              href={dashboardPath(user.role)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
                pathname.startsWith("/dashboard")
                  ? "text-[#d4432d] bg-[#d4432d]/10 font-bold"
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
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
                pathname === "/sign-in"
                  ? "text-[#d4432d] bg-[#d4432d]/10 font-bold"
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
