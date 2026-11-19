"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allow={["vendor"]}>{children}</AuthGuard>;
}
