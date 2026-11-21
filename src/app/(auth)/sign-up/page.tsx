"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  Store,
  User,
  X,
} from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import { clearToken, getSessionUser, refreshToken } from "@/lib/api";
import { dashboardPath, type UserRole } from "@/lib/types";
import { validateEmail, validatePassword } from "@/lib/validators";
import { GoogleButton } from "@/components/auth/google-button";
import { cn } from "@/lib/utils";

type RoleChoice = "customer" | "vendor";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [role, setRole] = useState<RoleChoice>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live password validation checklist
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) return setError("Please enter your full name.");
    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);
    const passwordError = validatePassword(password);
    if (passwordError) return setError(passwordError);
    if (role === "vendor" && businessName.trim().length < 2) {
      return setError("Please enter your restaurant name.");
    }

    setLoading(true);
    try {
      clearToken();
      const { error: authError } = await signUp.email({
        email,
        password,
        name: name.trim(),
        image: image.trim() || undefined,
        role,
        ...(role === "vendor" ? { businessName: businessName.trim() } : {}),
      } as never);

      if (authError) {
        setError(authError.message || "Could not create your account. Please try again.");
        return;
      }

      await refreshToken();
      const user = await getSessionUser();
      toast.success(`Welcome to PizzaHub, ${name.split(" ")[0]}!`);
      router.replace(user ? dashboardPath(user.role as UserRole) : "/dashboard");
      router.refresh();
    } catch {
      setError("Could not create your account right now. Please try again.");
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
      className="space-y-5 text-white"
    >
      {/* Title & Subtitle matching the reference mockup */}
      <div className="space-y-1">
        <h1 className="text-5xl sm:text-6xl font-normal tracking-tight text-[#c67c4e]">
          Welcome!
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base font-light tracking-wide pt-1">
          Today a beautifull day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Account Role Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={cn(
                "flex items-center justify-center gap-2 h-10 rounded-md text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                role === "customer"
                  ? "bg-[#c67c4e] border-[#c67c4e] text-white shadow-sm"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              )}
            >
              <User className="size-3.5" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={cn(
                "flex items-center justify-center gap-2 h-10 rounded-md text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                role === "vendor"
                  ? "bg-[#c67c4e] border-[#c67c4e] text-white shadow-sm"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              )}
            >
              <Store className="size-3.5" />
              <span>Vendor</span>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <div className="flex items-center h-11 bg-white rounded-md px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
            <User className="size-4 text-neutral-400 shrink-0" />
            <input
              id="name"
              placeholder="Full Name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Restaurant Name (if vendor) */}
        {role === "vendor" ? (
          <div className="space-y-1">
            <div className="flex items-center h-11 bg-white rounded-md px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
              <Store className="size-4 text-neutral-400 shrink-0" />
              <input
                id="businessName"
                placeholder="Restaurant / Pizzeria Name *"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
          </div>
        ) : null}

        {/* Email */}
        <div className="space-y-1">
          <div className="flex items-center h-11 bg-white rounded-md px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
            <Mail className="size-4 text-neutral-400 shrink-0" />
            <input
              id="email"
              type="email"
              placeholder="Username / Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center h-11 bg-white rounded-md px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
            <KeyRound className="size-4 text-neutral-400 shrink-0" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password (Min 6 chars, A-Z, a-z)"
              autoComplete="new-password"
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

          {/* Password requirements pills */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 px-1">
            <span
              className={cn(
                "flex items-center gap-1 font-medium",
                hasMinLength ? "text-emerald-400" : "text-neutral-500"
              )}
            >
              {hasMinLength ? (
                <Check className="size-3 text-emerald-400" />
              ) : (
                <X className="size-3 text-neutral-600" />
              )}
              6+ Chars
            </span>
            <span
              className={cn(
                "flex items-center gap-1 font-medium",
                hasUppercase ? "text-emerald-400" : "text-neutral-500"
              )}
            >
              {hasUppercase ? (
                <Check className="size-3 text-emerald-400" />
              ) : (
                <X className="size-3 text-neutral-600" />
              )}
              1 Uppercase (A-Z)
            </span>
            <span
              className={cn(
                "flex items-center gap-1 font-medium",
                hasLowercase ? "text-emerald-400" : "text-neutral-500"
              )}
            >
              {hasLowercase ? (
                <Check className="size-3 text-emerald-400" />
              ) : (
                <X className="size-3 text-neutral-600" />
              )}
              1 Lowercase (a-z)
            </span>
          </div>
        </div>

        {/* Optional Profile Image */}
        <div className="space-y-1">
          <div className="flex items-center h-11 bg-white rounded-md px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
            <ImageIcon className="size-4 text-neutral-400 shrink-0" />
            <input
              id="image"
              type="url"
              placeholder="Profile Image URL (optional)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-md bg-red-500/15 border border-red-500/30 px-3.5 py-2 text-xs font-medium text-red-400"
          >
            {error}
          </p>
        ) : null}

        {/* REGISTER Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-md bg-[#c67c4e] hover:bg-[#b56e42] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md active:scale-[0.99] flex items-center justify-center disabled:opacity-60 cursor-pointer mt-2"
        >
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          <span>{loading ? "CREATING ACCOUNT…" : "REGISTER"}</span>
        </button>

        {/* Social Google Sign Up */}
        <div className="pt-1">
          <GoogleButton
            onClick={handleGoogle}
            disabled={loading}
            label="Sign up with Google"
          />
        </div>
      </form>

      <p className="text-center text-xs text-neutral-400 pt-1">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-[#c67c4e] hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
