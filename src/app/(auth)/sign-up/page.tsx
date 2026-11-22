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

  function handleValidationError(msg: string, title = "Validation Error") {
    setError(msg);
    toast.error(title, {
      description: msg,
      duration: 5000,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      return handleValidationError("Please enter your full name (at least 2 characters).", "Name Required");
    }
    const emailError = validateEmail(email);
    if (emailError) {
      return handleValidationError(emailError, "Invalid Email");
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return handleValidationError(passwordError, "Weak Password");
    }
    if (role === "vendor" && businessName.trim().length < 2) {
      return handleValidationError("Please enter your restaurant or pizzeria name.", "Restaurant Name Required");
    }

    setLoading(true);
    try {
      clearToken();
      const { data, error: authError } = await signUp.email({
        email,
        password,
        name: name.trim(),
        image: image.trim() || undefined,
        role,
        ...(role === "vendor" ? { businessName: businessName.trim() } : {}),
      } as never);

      if (authError) {
        const msg = authError.message || "Could not create your account. Please try again.";
        setError(msg);
        toast.error("Registration Failed", {
          description: msg,
          duration: 5000,
        });
        return;
      }

      const sessionToken = (data as any)?.token;
      await refreshToken(sessionToken);
      const user = await getSessionUser(sessionToken);
      if (!user) {
        const msg = "Account created, but we could not start your session. Please sign in.";
        setError(msg);
        toast.info("Account Created", { description: msg });
        router.replace("/sign-in");
        return;
      }
      toast.success(`Welcome to PizzaHub, ${name.split(" ")[0]}!`);
      router.replace(dashboardPath(user.role as UserRole));
      router.refresh();
    } catch {
      const msg = "Could not create your account right now. Please check your connection and try again.";
      setError(msg);
      toast.error("Registration Error", {
        description: msg,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const res = await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
        errorCallbackURL: `${window.location.origin}/sign-in`,
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
      className="space-y-5 text-white"
    >
      {/* Title & Subtitle matching the reference mockup */}
      <div className="space-y-1">
        <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-[#c67c4e]">
          Welcome!
        </h1>
        <p className="text-neutral-400 text-sm font-normal tracking-wide pt-1">
          Today is a beautiful day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Account Role Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={cn(
                "flex items-center justify-center gap-2 h-9 rounded-xs text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                role === "customer"
                  ? "bg-[#c67c4e] border-[#c67c4e] text-white shadow-xs"
                  : "bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white"
              )}
            >
              <User className="size-3.5" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={cn(
                "flex items-center justify-center gap-2 h-9 rounded-xs text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                role === "vendor"
                  ? "bg-[#c67c4e] border-[#c67c4e] text-white shadow-xs"
                  : "bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white"
              )}
            >
              <Store className="size-3.5" />
              <span>Vendor</span>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <div className="flex items-center h-11 bg-white rounded-xs px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
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
            <div className="flex items-center h-11 bg-white rounded-xs px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
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
          <div className="flex items-center h-11 bg-white rounded-xs px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
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
          <div className="flex items-center h-11 bg-white rounded-xs px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
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
          <div className="flex items-center h-11 bg-white rounded-xs px-3.5 gap-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#c67c4e]">
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

        {/* Agreement Checkbox */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-400 hover:text-neutral-300">
            <input
              type="checkbox"
              required
              defaultChecked
              className="size-3.5 rounded-xs border-neutral-600 bg-neutral-900 text-[#c67c4e] focus:ring-[#c67c4e] cursor-pointer"
            />
            <span>I agree to PizzaHub terms and ordering policy</span>
          </label>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xs bg-red-500/15 border border-red-500/30 px-3.5 py-2 text-xs font-medium text-red-400"
          >
            {error}
          </p>
        ) : null}

        {/* REGISTER Button in terracotta copper */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xs bg-[#c67c4e] hover:bg-[#b56e42] text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all shadow-md active:scale-[0.99] flex items-center justify-center disabled:opacity-60 cursor-pointer mt-1"
        >
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          <span>{loading ? "CREATING ACCOUNT…" : "SIGN UP"}</span>
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
