"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getSessionUser } from "@/lib/api";
import { dashboardPath, type AppUser } from "@/lib/types";
import { toast } from "sonner";

function DashboardRouter() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSessionToken = searchParams.get("session_token");
  const [checkingFallback, setCheckingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function routeUser() {
      // 1. Direct Better Auth session check
      if (session?.user) {
        const user = session.user as unknown as AppUser;
        toast.success(`Welcome back, ${user.name?.split(" ")[0] || "User"}!`);
        router.replace(dashboardPath(user.role));
        return;
      }

      // 2. Token bridge check (with optional urlSessionToken from Google OAuth redirect)
      setCheckingFallback(true);
      try {
        const fallbackUser = await getSessionUser(urlSessionToken || undefined);
        if (cancelled) return;
        if (fallbackUser) {
          // Clean the session token from the browser URL for clean address bar
          if (urlSessionToken && typeof window !== "undefined") {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          toast.success(`Welcome back, ${fallbackUser.name?.split(" ")[0] || "User"}!`);
          router.replace(dashboardPath(fallbackUser.role));
          return;
        }
      } catch {
        // Fallback check failed
      } finally {
        if (!cancelled) setCheckingFallback(false);
      }

      // If still waiting on better-auth isPending, give it a moment
      if (isPending) return;

      // 3. Neither session nor token found — inform user and route to sign-in
      if (!cancelled) {
        toast.error("Session Expired", {
          description: "Please sign in to access your dashboard.",
          duration: 5000,
        });
        router.replace("/sign-in?error=session_expired&redirect=/dashboard");
      }
    }

    void routeUser();
    return () => {
      cancelled = true;
    };
  }, [session, isPending, router, urlSessionToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors">
      <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
        <span className="size-5 animate-spin rounded-full border-2 border-[#c8402b] border-t-transparent" />
        {checkingFallback ? "Verifying your session…" : "Opening your dashboard…"}
      </div>
    </div>
  );
}

export default function DashboardIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
            <span className="size-5 animate-spin rounded-full border-2 border-[#c8402b] border-t-transparent" />
            Loading your dashboard…
          </div>
        </div>
      }
    >
      <DashboardRouter />
    </Suspense>
  );
}
