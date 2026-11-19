export type UserRole = "customer" | "vendor" | "admin";
export type SubscriptionPlan = "free" | "premium";

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
}

export type MenuCategory =
  | "Classic Pizzas"
  | "Vegetarian Pizzas"
  | "Meat Lovers"
  | "Specialty / Gourmet Pizzas"
  | "Sides & Appetizers"
  | "Beverages & Desserts";

export const MENU_CATEGORIES: MenuCategory[] = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export type MenuItemStatus = "pending" | "approved" | "rejected" | "inactive";

export interface MenuItem {
  _id: string;
  id?: string;
  vendorId: string | {
    _id: string;
    name: string;
    businessName?: string;
    image?: string;
    subscriptionPlan?: SubscriptionPlan;
  };
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: MenuItemStatus;
  rejectionReason?: string | null;
  rating?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface Order {
  _id: string;
  id?: string;
  itemId: MenuItem | string;
  vendorId: User | string;
  customerId: User | string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  _id: string;
  id?: string;
  vendorId: User | string;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId?: string;
  status: "pending" | "paid" | "failed" | "expired";
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

