"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Pizza,
  PlusCircle,
  Settings,
  ShoppingBag,
  Store,
  Sun,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { clearToken, getSessionUser } from "@/lib/api";
import type { AppUser } from "@/lib/types";
import { useTheme } from "@/context/theme-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BrandLogo } from "@/components/layout/brand-logo";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV: Record<string, NavItem[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/vendor/items", label: "My Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/vendor/orders", label: "Customer Orders", icon: ClipboardList },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: CreditCard },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingBag },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: BarChart3, exact: true },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/items", label: "Manage Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/admin/orders", label: "Manage Orders", icon: ClipboardList },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
  ],
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<AppUser | undefined>(session?.user as unknown as AppUser | undefined);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as unknown as AppUser);
    } else {
      void getSessionUser().then((u) => {
        if (u) setUser(u as unknown as AppUser);
      });
    }
  }, [session]);

  const role = user?.role ?? "customer";
  const items = NAV[role] ?? NAV.customer;

  async function handleSignOut() {
    await signOut();
    clearToken();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-4 border-b border-border/40">
        <BrandLogo size="sm" />
      </div>

      {/* Main Navigation links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#c8402b] text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Pinned Section: Profile & Logout */}
      <div className="mt-auto border-t border-border p-3 space-y-2">
        <Link
          href="/profile"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg p-2.5 transition-colors border",
            pathname === "/profile"
              ? "bg-[#c8402b]/10 border-[#c8402b]/30 text-foreground"
              : "bg-muted/50 border-border hover:bg-muted text-foreground"
          )}
          title="Click to view Profile Settings"
        >
          <Avatar className="size-9 ring-1 ring-border shrink-0">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
            <AvatarFallback className="bg-[#c8402b] text-white font-semibold">
              {(user?.name ?? "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{user?.name ?? "Loading…"}</p>
            <p className="truncate text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="text-[#c8402b] hover:underline font-medium">Profile Settings</span>
            </p>
          </div>
          <Settings className="size-4 text-muted-foreground shrink-0" />
        </Link>

        {role === "vendor" ? (
          <Badge
            className={cn(
              "w-full justify-center text-[10px] uppercase tracking-wide",
              user?.subscriptionPlan === "premium"
                ? "bg-[#f0a23c] text-[#3b1c12] font-bold"
                : "bg-muted text-muted-foreground border border-border"
            )}
          >
            {user?.subscriptionPlan === "premium" ? "Premium plan" : "Free plan"}
          </Badge>
        ) : null}

        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="size-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card text-card-foreground lg:block transition-colors">{sidebar}</aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85%] border-r border-border bg-card text-card-foreground transition-colors">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Dedicated Dashboard Header Bar (Sticky, separate from public site header) */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8 transition-colors">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden text-foreground hover:bg-muted"
            >
              <Menu className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold capitalize text-foreground">
                {role} Console
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex border-[#c8402b]/30 bg-[#c8402b]/10 text-[#c8402b] text-[11px] font-semibold dark:border-[#f0a23c]/30 dark:bg-[#f0a23c]/10 dark:text-[#f0a23c]">
                PizzaHub Dashboard
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Visit Store / Home button */}
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex border-border bg-card text-xs font-semibold text-foreground hover:bg-muted">
              <Link href="/">
                <Store className="mr-1.5 size-3.5 text-[#c8402b]" />
                Back to Site
              </Link>
            </Button>

            {/* Dark / Light Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-foreground hover:bg-muted"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            {/* User Profile & Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted focus:outline-none"
                  aria-label="User menu"
                >
                  <Avatar className="size-8 ring-2 ring-[#c8402b]/20">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
                    <AvatarFallback className="bg-[#c8402b] text-xs font-bold text-white">
                      {(user?.name ?? "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">{user?.name ?? "Account"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/menu" className="cursor-pointer">
                    <Store className="mr-2 size-4" />
                    Visit Pizza Store
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Main Content (NO public footer) */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
