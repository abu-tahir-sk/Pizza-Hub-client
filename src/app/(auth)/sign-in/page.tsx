"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles, Store, UserCheck } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { clearToken, getSessionUser, refreshToken } from "@/lib/api";
import { dashboardPath, type UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/google-button";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("blocked") === "1") {
      toast.error("Your account has been blocked. Please contact support.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      clearToken();
      const { error: authError } = await signIn.email({ email, password });
      if (authError) {
        setError(authError.message || "Invalid email or password.");
        return;
      }

      await refreshToken();
      const user = await getSessionUser();
      if (!user) {
        setError("Signed in, but the session could not be verified. Please try again.");
        return;
      }
      if (user.isBlocked) {
        setError("Your account has been blocked. Please contact support.");
        return;
      }

      toast.success(`Welcome back, ${user.name.split(" ")[0]}! 🍕`);
      router.replace(redirectTo || dashboardPath(user.role as UserRole));
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c8402b]/10 px-3 py-1 text-xs font-semibold text-[#c8402b]">
          <ShieldCheck className="size-3.5" /> Secure Authentication
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Welcome back to Pizza<span className="text-[#f0a23c]">Hub</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to order hot artisan pizza or manage your restaurant dashboard.
        </p>
      </div>

      <GoogleButton onClick={handleGoogle} disabled={loading} label="Continue with Google" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-background px-3 text-muted-foreground font-medium">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-semibold text-foreground">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 bg-card border-border focus-visible:ring-[#c8402b]"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-semibold text-foreground">Password</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 pr-11 bg-card border-border focus-visible:ring-[#c8402b]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-[#c8402b] text-base font-semibold text-white shadow-md transition-all hover:bg-[#ad3521] hover:shadow-lg active:scale-[0.99]"
        >
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {loading ? "Signing in…" : "Sign In to PizzaHub"}
        </Button>

        {/* 1-Click Fast Fill for Recruiters */}
        <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 p-3.5 text-xs text-amber-950 dark:text-amber-200">
          <p className="font-bold mb-2 flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
            <Sparkles className="size-4 text-[#f0a23c]" />
            Recruiter &amp; Evaluator Quick-Login (1-Click Fill):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@pizzahub.com");
                setPassword("Admin123");
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-300/60 bg-card px-2.5 py-1.5 text-[11px] font-semibold text-[#c8402b] shadow-xs transition-colors hover:bg-amber-500/20"
            >
              <ShieldCheck className="size-3.5" />
              Fill Admin (admin@pizzahub.com)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("napoli@pizzahub.com");
                setPassword("Napoli123");
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-300/60 bg-card px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300 shadow-xs transition-colors hover:bg-amber-500/20"
            >
              <Store className="size-3.5" />
              Fill Vendor (napoli@pizzahub.com)
            </button>
          </div>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to PizzaHub?{" "}
        <Link href="/sign-up" className="font-semibold text-[#c8402b] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-card border border-border" />}>
      <SignInForm />
    </Suspense>
  );
}
