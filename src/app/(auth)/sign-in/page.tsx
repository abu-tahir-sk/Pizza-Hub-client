"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, Mail, ShieldCheck, Sparkles, Store, User } from "lucide-react";
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pizzahub:remember-email");
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch {
      // localStorage may be unavailable (private mode) — ignore.
    }
  }, []);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      let title = "Sign-in Failed";
      let desc = "Google sign-in was unsuccessful. Please sign in with your password.";
      if (errorParam === "account_not_linked") {
        title = "Account Already Exists";
        desc = "This email is already registered with a password. Please sign in using your email & password.";
      } else if (errorParam === "state_mismatch") {
        title = "Session Expired";
        desc = "The authentication request timed out or was blocked by browser privacy settings. Please sign in using your password.";
      } else if (errorParam === "access_denied") {
        title = "Access Denied";
        desc = "Google sign-in was cancelled or access was denied.";
      } else if (errorParam === "google_failed" || errorParam === "oauth_failed") {
        title = "Google Sign-In Failed";
        desc = "Google sign-in could not be completed. Please try again or sign in with your email and password.";
      } else if (errorParam === "session_expired") {
        title = "Session Required";
        desc = "Your session expired or was not found. Please sign in to access your dashboard.";
      }
      setError(desc);
      toast.error(title, {
        description: desc,
        duration: 6000,
      });
    }

    if (searchParams.get("blocked") === "1") {
      const msg = "Your account has been blocked. Please contact support.";
      setError(msg);
      toast.error("Account Blocked", {
        description: msg,
        duration: 6000,
      });
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      const msg = "Please enter your email address.";
      setError(msg);
      toast.error("Missing Email", { description: msg });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      toast.error("Invalid Email", { description: msg });
      return;
    }

    if (!password) {
      const msg = "Please enter your password.";
      setError(msg);
      toast.error("Missing Password", { description: msg });
      return;
    }

    setLoading(true);
    try {
      clearToken();
      const { error: authError } = await signIn.email({ email: trimmedEmail, password });
      if (authError) {
        const msg = authError.message || "Invalid email or password.";
        setError(msg);
        toast.error("Sign-in Failed", {
          description: msg,
          duration: 5000,
        });
        return;
      }

      await refreshToken();
      const user = await getSessionUser();
      if (!user) {
        const msg = "Signed in, but the session could not be verified. Please try again.";
        setError(msg);
        toast.error("Session Verification Failed", { description: msg });
        return;
      }
      if (user.isBlocked) {
        const msg = "Your account has been blocked. Please contact support.";
        setError(msg);
        toast.error("Account Blocked", { description: msg });
        return;
      }

      try {
        if (rememberMe) localStorage.setItem("pizzahub:remember-email", trimmedEmail);
        else localStorage.removeItem("pizzahub:remember-email");
      } catch {
        // ignore storage failures
      }

      setSuccessMsg("Signed in successfully! Redirecting...");
      toast.success("Signed in successfully!", {
        description: `Welcome back, ${user.name?.split(" ")[0] || "User"}!`,
      });

      // Redirect user according to their role
      const targetPath =
        redirectTo && !redirectTo.startsWith("/dashboard")
          ? redirectTo
          : dashboardPath(user.role as UserRole);

      router.replace(targetPath);
      router.refresh();
    } catch {
      const msg = "Unable to sign in right now. Please check your connection and try again.";
      setError(msg);
      toast.error("Sign-in Error", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
        errorCallbackURL: `${window.location.origin}/sign-in?error=google_failed`,
      });
      if (res?.error) {
        const msg = res.error.message || "Could not initiate Google sign-in. Please try again.";
        setError(msg);
        toast.error("Google Sign-In Error", { description: msg });
        setLoading(false);
      }
    } catch {
      const msg = "Unable to connect to Google sign-in. Please check your connection.";
      setError(msg);
      toast.error("Google Sign-In Failed", { description: msg });
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 text-white w-full"
    >
      {/* Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-[#c67c4e]">
          Sign In
        </h1>
        <p className="text-neutral-400 text-sm font-normal tracking-wide pt-1">
          Welcome back! Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email field */}
        <div className="space-y-1">
          <div className="flex items-center h-12 bg-white rounded-xs px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
            <Mail className="size-4 text-neutral-400 shrink-0" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1">
          <div className="flex items-center h-12 bg-white rounded-xs px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
            <KeyRound className="size-4 text-neutral-400 shrink-0" />
            <input
              id="password"
              name="password"
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

        {/* Remember me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-400 hover:text-neutral-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-3.5 rounded-xs border-neutral-600 bg-neutral-900 text-[#c67c4e] focus:ring-[#c67c4e] cursor-pointer"
            />
            <span>Remember me</span>
          </label>
        </div>

        {/* Inline Error Message */}
        {error ? (
          <p
            role="alert"
            className="rounded-xs bg-red-500/15 border border-red-500/30 px-3.5 py-2.5 text-xs font-medium text-red-400"
          >
            {error}
          </p>
        ) : null}

        {/* Inline Success Message */}
        {successMsg ? (
          <p
            role="status"
            className="rounded-xs bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2.5 text-xs font-medium text-emerald-400"
          >
            {successMsg}
          </p>
        ) : null}

        {/* SIGN IN Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xs bg-[#c67c4e] hover:bg-[#b56e42] text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all shadow-md active:scale-[0.99] flex items-center justify-center disabled:opacity-60 cursor-pointer"
        >
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          <span>{loading ? "SIGNING IN…" : "SIGN IN"}</span>
        </button>

        {/* Forgot password link */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => toast.info("Password reset: Please sign in with your password or use Google Sign-In.")}
            className="text-xs text-neutral-400 hover:text-[#c67c4e] transition-colors cursor-pointer"
          >
            Forgot password?
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
