"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { getSessionUser } from "@/lib/api";
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
      const { error: authError } = await signIn.email({ email, password });
      if (authError) {
        setError(authError.message || "Invalid email or password.");
        return;
      }

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
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#3b1c12]">Welcome back</h1>
        <p className="text-sm text-[#7a5c4d]">
          Sign in to order pizza or manage your restaurant.
        </p>
      </div>

      <GoogleButton onClick={handleGoogle} disabled={loading} label="Continue with Google" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#ecd9c6]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-[#fffaf3] px-3 text-[#a18573]">or sign in with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 bg-white"
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-[#c8402b] text-base font-semibold text-white hover:bg-[#ad3521]"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#7a5c4d]">
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
    <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white/60" />}>
      <SignInForm />
    </Suspense>
  );
}
