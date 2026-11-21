"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, Mail, ShieldCheck, Sparkles, Store } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { clearToken, getSessionUser, refreshToken } from "@/lib/api";
import { dashboardPath, type UserRole } from "@/lib/types";
import { GoogleButton } from "@/components/auth/google-button";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "account_not_linked") {
      const msg = "This email is already registered with a password. Please sign in using your email & password.";
      setError(msg);
      toast.error(msg, {
        description: "An account with this email already exists with password credentials. Please sign in using your password.",
        duration: 6000,
      });
      router.replace(redirectTo ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}` : "/sign-in");
    } else if (errorParam) {
      const msg = "Google sign-in was unsuccessful. Please sign in with your password.";
      setError(msg);
      toast.error(msg, { duration: 5000 });
      router.replace(redirectTo ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}` : "/sign-in");
    }

    if (searchParams.get("blocked") === "1") {
      toast.error("Your account has been blocked. Please contact support.");
    }
  }, [searchParams, router, redirectTo]);

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

      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
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
      errorCallbackURL: `${window.location.origin}/sign-in`,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 text-white w-full"
    >
      {/* Title & Subtitle matching the reference mockup */}
      <div className="space-y-1">
        <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-[#c67c4e]">
          Welcome!
        </h1>
        <p className="text-neutral-400 text-sm font-normal tracking-wide pt-1">
          Today a beautifull day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Username / Email field with Mail icon and pure white background */}
        <div className="space-y-1">
          <div className="flex items-center h-12 bg-white rounded-xs px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
            <Mail className="size-4 text-neutral-400 shrink-0" />
            <input
              id="email"
              type="email"
              placeholder="Username"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Password field with Key icon, pure white background, and eye toggle */}
        <div className="space-y-1">
          <div className="flex items-center h-12 bg-white rounded-xs px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
            <KeyRound className="size-4 text-neutral-400 shrink-0" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Remember my username Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-400 hover:text-neutral-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-3.5 rounded-xs border-neutral-600 bg-neutral-900 text-[#c67c4e] focus:ring-[#c67c4e] cursor-pointer"
            />
            <span>Remember my username</span>
          </label>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xs bg-red-500/15 border border-red-500/30 px-3.5 py-2.5 text-xs font-medium text-red-400"
          >
            {error}
          </p>
        ) : null}

        {/* LOGIN Button in terracotta copper */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xs bg-[#c67c4e] hover:bg-[#b56e42] text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all shadow-md active:scale-[0.99] flex items-center justify-center disabled:opacity-60 cursor-pointer"
        >
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          <span>{loading ? "LOGGING IN…" : "LOGIN"}</span>
        </button>

        {/* Forgot password link */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => toast.info("Password reset: Please sign in with your password or use Google Sign-In.")}
            className="text-xs text-neutral-400 hover:text-[#c67c4e] transition-colors cursor-pointer"
          >
            Forgot password ?
          </button>
        </div>

        {/* Social Google Login */}
        <div className="pt-2">
          <GoogleButton
            onClick={handleGoogle}
            disabled={loading}
            label="Continue with Google"
          />
        </div>

        {/* 1-Click Fast Fill for Recruiters */}
        <div className="rounded-xl border border-[#c67c4e]/30 bg-[#c67c4e]/10 p-3.5 text-xs text-neutral-300">
          <p className="font-bold mb-2 flex items-center gap-1.5 text-[#f5c29f]">
            <Sparkles className="size-3.5 text-[#c67c4e]" />
            Recruiter &amp; Evaluator Quick-Login:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@pizzahub.com");
                setPassword("Admin123");
              }}
              className="flex items-center justify-center gap-1.5 rounded-xs border border-[#c67c4e]/40 bg-neutral-900/80 px-2.5 py-1.5 text-[11px] font-semibold text-[#f5c29f] transition-colors hover:bg-[#c67c4e]/20 cursor-pointer"
            >
              <ShieldCheck className="size-3.5 text-[#c67c4e]" />
              Fill Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("napoli@pizzahub.com");
                setPassword("Napoli123");
              }}
              className="flex items-center justify-center gap-1.5 rounded-xs border border-[#c67c4e]/40 bg-neutral-900/80 px-2.5 py-1.5 text-[11px] font-semibold text-[#f5c29f] transition-colors hover:bg-[#c67c4e]/20 cursor-pointer"
            >
              <Store className="size-3.5 text-[#c67c4e]" />
              Fill Vendor
            </button>
          </div>
        </div>
      </form>

      <p className="text-center text-xs text-neutral-400 pt-1">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold text-[#c67c4e] hover:underline">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 animate-pulse rounded-xl bg-neutral-900 border border-neutral-800" />
      }
    >
      <SignInForm />
    </Suspense>
  );
}
