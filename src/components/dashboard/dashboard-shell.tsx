"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Pizza,
  PlusCircle,
  Settings,
  ShoppingBag,
  Store,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import type { AppUser } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    { href: "/dashboard/vendor/items/new", label: "Add Menu Item", icon: PlusCircle },
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
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
  ],
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user as unknown as AppUser | undefined;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid size-9 place-items-center rounded-full bg-[#c8402b] text-white">
          <Pizza className="size-5" />
        </span>
        <span className="text-xl font-extrabold tracking-tight text-white">
          Pizza<span className="text-[#f0a23c]">Hub</span>
        </span>
      </Link>

      <div className="mx-4 mb-4 rounded-lg bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
            <AvatarFallback className="bg-[#c8402b] text-white">
              {(user?.name ?? "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name ?? "Loading…"}</p>
            <p className="truncate text-xs capitalize text-[#d9bfae]">{role}</p>
          </div>
        </div>
        {role === "vendor" ? (
          <Badge
            className={cn(
              "mt-2 text-[10px] uppercase tracking-wide",
              user?.subscriptionPlan === "premium"
                ? "bg-[#f0a23c] text-[#3b1c12]"
                : "bg-white/10 text-[#e8d3c1]"
            )}
          >
            {user?.subscriptionPlan === "premium" ? "Premium plan" : "Free plan"}
          </Badge>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
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
                  : "text-[#d9bfae] hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <div className="my-3 h-px bg-white/10" />

        <Link
          href="/profile"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/profile"
              ? "bg-[#c8402b] text-white"
              : "text-[#d9bfae] hover:bg-white/10 hover:text-white"
          )}
        >
          <Settings className="size-4 shrink-0" />
          Profile Settings
        </Link>
        <Link
          href="/menu"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#d9bfae] transition-colors hover:bg-white/10 hover:text-white"
        >
          <Store className="size-4 shrink-0" />
          Browse Menu
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#fca5a5] transition-colors hover:bg-red-500/10"
        >
          <LogOut className="size-4 shrink-0" />
          Logout
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f4ee]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-[#2b120c] lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85%] bg-[#2b120c]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-white/70 hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e8dccd] bg-[#f8f4ee]/95 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <span className="text-sm font-bold capitalize text-[#3b1c12]">{role} Dashboard</span>
          <Avatar className="size-8">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
            <AvatarFallback className="bg-[#c8402b] text-xs text-white">
              {(user?.name ?? "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
