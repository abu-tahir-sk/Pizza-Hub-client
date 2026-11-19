"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { dashboardPath, type AppUser } from "@/lib/types";

export default function DashboardIndexPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/sign-in?redirect=/dashboard");
      return;
    }
    const user = session.user as unknown as AppUser;
    router.replace(dashboardPath(user.role));
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf3]">
      <div className="flex items-center gap-3 text-[#7a5c4d]">
        <span className="size-5 animate-spin rounded-full border-2 border-[#c8402b] border-t-transparent" />
        Opening your dashboard…
      </div>
    </div>
  );
}
