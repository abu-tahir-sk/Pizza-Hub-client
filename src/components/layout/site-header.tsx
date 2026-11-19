"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, Moon, Pizza, Sun, X } from "lucide-react";
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

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
  { href: "/favorites", label: "Favorites" },
];

export function SiteHeader() {
  const { data: session, isPending } = useSession();
  const user = session?.user as unknown as AppUser | undefined;
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    clearToken();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-[#c8402b] text-white shadow-sm">
            <Pizza className="size-5" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            Pizza<span className="text-[#f0a23c]">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                pathname === link.href ? "text-[#c8402b] font-semibold dark:text-[#f0a23c]" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link
              href={dashboardPath(user.role)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                pathname.startsWith("/dashboard") ? "text-[#c8402b] font-semibold dark:text-[#f0a23c]" : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
          ) : null}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            type="button"
            variant="ghost"
            size="icon"
            aria-label="View saved favorites"
            className="relative text-muted-foreground hover:text-[#c8402b]"
          >
            <Link href="/favorites">
              <Heart className="size-4" />
              {favorites.length > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-[#c8402b] text-[10px] font-bold text-white shadow">
                  {favorites.length}
                </span>
              ) : null}
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {isPending ? (
            <div className="hidden h-9 w-24 animate-pulse rounded-lg bg-muted sm:block" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 text-left transition-colors hover:bg-muted">
                  <Avatar className="size-8">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate text-sm font-semibold text-foreground sm:block">
                    {user.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[#c8402b]">
                    {user.role}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardPath(user.role)}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleSignOut}
                  className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/40"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521]">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen ? (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={dashboardPath(user.role)}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Dashboard ({user.role})
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Profile Settings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void handleSignOut();
                  }}
                  className="text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Button asChild variant="outline">
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521]">
                  <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-border flex items-center justify-between px-3 py-1">
              <span className="text-xs font-medium text-muted-foreground">Theme</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#6b4a3a] px-2.5 py-1 rounded-md bg-[#f7ead9]"
              >
                {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
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
