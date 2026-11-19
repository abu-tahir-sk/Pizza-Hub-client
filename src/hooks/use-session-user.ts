"use client";

import { useSession } from "@/lib/auth-client";
import type { AppUser } from "@/lib/types";

/** Typed access to the authenticated Better Auth user. */
export function useSessionUser(): AppUser | undefined {
  const { data: session } = useSession();
  return session?.user as unknown as AppUser | undefined;
}
