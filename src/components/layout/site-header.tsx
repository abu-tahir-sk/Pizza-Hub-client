"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
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

  const isHomeActive = pathname === "/";
  const isMenuActive = pathname === "/menu" || pathname.startsWith("/menu/");
  const isDashboardActive = pathname.startsWith("/dashboard");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-xs transition-colors">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo / Name: PizzaHub */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#c8402b] to-[#e65c47] text-white shadow-md shadow-[#c8402b]/25 transition-transform group-hover:scale-105">
              <Pizza className="size-6 stroke-[2.2]" />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center text-2xl font-black tracking-tight leading-none text-foreground">
                <span>Pizza</span>
                <span className="text-[#f0a23c]">Hub</span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mt-1">
                FRESH & FAST
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Same background as Navbar */}
          <nav className="hidden items-center gap-2 lg:flex">
            {/* 1. Home */}
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                isHomeActive
                  ? "bg-[#c8402b]/10 text-[#c8402b] dark:text-[#f0a23c]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Home className="size-4" />
              <span>Home</span>
            </Link>

            {/* 2. Browse Menu */}
            <Link
              href="/menu"
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                isMenuActive
                  ? "bg-[#c8402b]/10 text-[#c8402b] dark:text-[#f0a23c]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <UtensilsCrossed className="size-4" />
              <span>Browse Menu</span>
            </Link>

            {/* 3. Role-Relevant Dashboard Link (when logged in) */}
            {user && (
              <Link
                href={dashboardPath(user.role)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                  isDashboardActive && !pathname.includes("/orders")
                    ? "bg-[#c8402b]/10 text-[#c8402b] dark:text-[#f0a23c]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </Link>
            )}

            {/* 4. Customer Quick Link: My Orders */}
            {user && user.role === "customer" && (
              <Link
                href="/dashboard/customer/orders"
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                  pathname.startsWith("/dashboard/customer/orders")
                    ? "bg-[#c8402b]/10 text-[#c8402b] dark:text-[#f0a23c]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <ShoppingBag className="size-4" />
                <span>My Orders</span>
              </Link>
            )}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist / Favorites quick button */}
            <Button
              asChild
              type="button"
              variant="outline"
              size="icon"
              aria-label="View saved favorites"
              className="relative rounded-xl size-10 border-border text-muted-foreground hover:text-[#c8402b] hover:border-[#c8402b]/40 hover:bg-muted hidden sm:inline-flex"
            >
              <Link href="/favorites">
                <Heart className="size-4" />
                {favorites.length > 0 ? (
                  <span className="absolute -right-1 -top-1 grid size-4.5 place-items-center rounded-full bg-[#c8402b] text-[10px] font-black text-white shadow-md animate-pulse">
                    {favorites.length}
                  </span>
                ) : null}
              </Link>
            </Button>

            {/* Auth Dependent Controls */}
            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              /* Profile Dropdown: User Name & Avatar */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-full border border-border bg-card pl-3.5 pr-1.5 py-1.5 text-left transition-all hover:border-[#c8402b]/40 hover:shadow-sm focus:outline-none cursor-pointer">
                    <span className="max-w-36 truncate text-sm font-bold text-foreground sm:block">
                      {user.name}
                    </span>
                    <Avatar className="size-8 ring-2 ring-[#c8402b]/20">
                      <AvatarImage src={user.image ?? undefined} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#c8402b] to-[#e65c47] text-white text-xs font-black">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border-border bg-card">
                  <DropdownMenuLabel className="font-normal px-3 py-2 bg-muted/50 rounded-xl mb-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#c8402b]/15 text-[#c8402b]">
                        {user.role}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground mt-0.5">{user.email}</p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1" />

                  {/* 1. Dashboard (Required) */}
                  <DropdownMenuItem asChild className="rounded-xl font-semibold cursor-pointer py-2.5">
                    <Link href={dashboardPath(user.role)}>
                      <LayoutDashboard className="size-4 mr-2 text-[#c8402b]" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {/* 2. Profile Settings (Required) */}
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

                  {/* Theme appearance toggle */}
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

                  {/* 3. Logout (Required) */}
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
                  className="font-bold rounded-xl text-foreground hover:text-[#c8402b] hover:bg-muted text-sm px-3 sm:px-4"
                >
                  <Link href="/sign-in">
                    <LogIn className="size-4 mr-1.5" />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#c8402b] to-[#e65c47] font-bold text-white hover:opacity-95 shadow-md shadow-[#c8402b]/20 rounded-xl px-4 sm:px-5 text-sm"
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
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
              pathname.startsWith("/menu")
                ? "text-[#c8402b] bg-[#c8402b]/10 font-bold"
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
                ? "text-[#c8402b] bg-[#c8402b]/10 font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart className="size-5" />
            <span className="text-[10px] font-semibold leading-none">Favorites</span>
            {favorites.length > 0 ? (
              <span className="absolute right-2 top-1 grid size-4 place-items-center rounded-full bg-[#c8402b] text-[9px] font-black text-white shadow">
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
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
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
