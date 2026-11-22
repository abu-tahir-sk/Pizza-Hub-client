"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { getSessionUser } from "@/lib/api";
import type { AppUser, UserRole } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-side route guard.
 * - Checks Better Auth session AND cross-domain token bridge
 * - Unauthenticated visitors are redirected to /sign-in?redirect=<path>
 * - Users with the wrong role are redirected to their own dashboard
 * - Blocked users are signed out and sent back to sign-in
 */
export function AuthGuard({
  allow,
  children,
}: {
  allow?: UserRole[];
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSessionToken = searchParams?.get("session_token");

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function evaluateAuth() {
      // 1. Direct Better Auth session check
      if (session?.user) {
        const u = session.user as unknown as AppUser;
        if (cancelled) return;
        checkAccess(u);
        return;
      }

      // If still waiting on better-auth isPending, give it a moment
      if (isPending) return;

      // 2. Token bridge check (with optional urlSessionToken from OAuth callback)
      try {
        const bridgeUser = await getSessionUser(urlSessionToken || undefined);
        if (cancelled) return;
        if (bridgeUser) {
          if (urlSessionToken && typeof window !== "undefined") {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          checkAccess(bridgeUser as unknown as AppUser);
          return;
        }
      } catch {
        // Fallback check failed
      }

      // 3. Unauthenticated visitors are redirected to /sign-in
      if (!cancelled) {
        router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      }
    }

    function checkAccess(u: AppUser) {
      if (u.isBlocked) {
        void signOut();
        router.replace("/sign-in?blocked=1");
        return;
      }

      if (allow && !allow.includes(u.role)) {
        router.replace(roleHome(u.role));
        return;
      }

      setReady(true);
    }

    void evaluateAuth();

    return () => {
      cancelled = true;
    };
  }, [isPending, session, allow, pathname, router, urlSessionToken]);

  if (isPending || !ready) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 p-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}

function roleHome(role: UserRole) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "vendor") return "/dashboard/vendor";
  return "/dashboard/customer";
}
