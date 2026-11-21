"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled client error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 py-20 text-center transition-colors">
      <span className="grid size-20 place-items-center rounded-full bg-red-100 text-[#c8402b] dark:bg-red-950/50 dark:text-red-400">
        <AlertTriangle className="size-10" />
      </span>
      <p className="mt-6 text-sm font-bold uppercase tracking-wider text-[#c8402b]">
        Something went wrong
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
        We encountered an unexpected error
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        An error occurred while loading this page. You can try refreshing or returning to the home page.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} className="bg-[#c8402b] hover:bg-[#ad3521]">
          <RefreshCw className="mr-2 size-4" /> Try again
        </Button>
        <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted">
          <Link href="/">
            <Home className="mr-2 size-4" /> Back home
          </Link>
        </Button>
      </div>
    </div>
  );
}
