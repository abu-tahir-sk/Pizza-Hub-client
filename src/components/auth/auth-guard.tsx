"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import type { AppUser, UserRole } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-side route guard.
 * - Unauthenticated visitors are redirected to /sign-in?redirect=<path>
 * - Users with the wrong role are redirected to their own dashboard
 * - Blocked users are signed out and sent back to sign-in
 *
 * This is a UX guard only: every protected API also verifies the JWT and
 * role on the Express server (defense in depth).
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
  const [ready, setReady] = useState(false);

  const user = session?.user as unknown as AppUser | undefined;

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user?.isBlocked) {
      void signOut();
      router.replace("/sign-in?blocked=1");
      return;
    }

    if (allow && user && !allow.includes(user.role)) {
      router.replace(roleHome(user.role));
      return;
    }

    setReady(true);
  }, [isPending, session, user, allow, pathname, router]);

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
