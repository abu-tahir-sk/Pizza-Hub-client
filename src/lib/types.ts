// Canonical domain types live in src/types/index.ts.
// This module re-exports the aliases + helpers used by the API layer.
export type {
  User as AppUser,
  UserRole,
  MenuItem,
  Order,
  Transaction,
  MenuCategory,
  MenuItemStatus,
  SubscriptionPlan,
} from "@/types";

export { MENU_CATEGORIES } from "@/types";
export type { User } from "@/types";

export const CATEGORY_EMOJI: Record<string, string> = {
  "Classic Pizzas": "🍕",
  "Vegetarian Pizzas": "🥬",
  "Meat Lovers": "🥓",
  "Specialty / Gourmet Pizzas": "⭐",
  "Sides & Appetizers": "🧄",
  "Beverages & Desserts": "🥤",
};

export function dashboardPath(role: "customer" | "vendor" | "admin"): string {
  switch (role) {
    case "vendor":
      return "/dashboard/vendor";
    case "admin":
      return "/dashboard/admin";
    default:
      return "/dashboard/customer";
  }
}

/** Vendor fields embedded on populated menu items / orders. */
export interface VendorInfo {
  _id?: string;
  id?: string;
  name?: string;
  businessName?: string | null;
  image?: string | null;
  subscriptionPlan?: "free" | "premium";
}
