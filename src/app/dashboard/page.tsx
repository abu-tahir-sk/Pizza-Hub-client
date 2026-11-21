"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getSessionUser } from "@/lib/api";
import { dashboardPath, type AppUser } from "@/lib/types";
import { toast } from "sonner";

export default function DashboardIndexPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [checkingFallback, setCheckingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function routeUser() {
      if (isPending) return;

      // 1. Direct Better Auth session check
      if (session?.user) {
        const user = session.user as unknown as AppUser;
        router.replace(dashboardPath(user.role));
        return;
      }

      // 2. Token bridge check (for cross-domain cookie verification)
      setCheckingFallback(true);
      try {
        const fallbackUser = await getSessionUser();
        if (cancelled) return;
        if (fallbackUser) {
          router.replace(dashboardPath(fallbackUser.role));
          return;
        }
      } catch {
        // Fallback check failed
      } finally {
        if (!cancelled) setCheckingFallback(false);
      }

      // 3. Neither session nor token found — inform user and route to sign-in
      if (!cancelled) {
        toast.error("Please sign in to access your dashboard.");
        router.replace("/sign-in?redirect=/dashboard");
      }
    }

    void routeUser();
    return () => {
      cancelled = true;
    };
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors">
      <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
        <span className="size-5 animate-spin rounded-full border-2 border-[#c8402b] border-t-transparent" />
        {checkingFallback ? "Verifying your session…" : "Opening your dashboard…"}
      </div>
    </div>
  );
}
