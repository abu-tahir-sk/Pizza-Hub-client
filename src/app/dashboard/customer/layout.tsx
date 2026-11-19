"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allow={["customer"]}>{children}</AuthGuard>;
}
