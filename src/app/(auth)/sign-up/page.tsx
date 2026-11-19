"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Eye, EyeOff, Loader2, ShieldCheck, Sparkles, Store, User, X } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import { getSessionUser } from "@/lib/api";
import { dashboardPath, type UserRole } from "@/lib/types";
import { validateEmail, validatePassword } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GoogleButton } from "@/components/auth/google-button";

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

      const user = await getSessionUser();
      toast.success(`Welcome to PizzaHub, ${name.split(" ")[0]}! 🍕`);
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
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c8402b]/10 px-3 py-1 text-xs font-semibold text-[#c8402b]">
          <Sparkles className="size-3.5 text-[#f0a23c]" /> Quick &amp; Easy Registration
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Join Pizza<span className="text-[#f0a23c]">Hub</span> Today
        </h1>
        <p className="text-sm text-muted-foreground">
          Order oven-fresh pizza or create your restaurant store in under two minutes.
        </p>
      </div>

      <GoogleButton onClick={handleGoogle} disabled={loading} label="Sign up with Google" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-background px-3 text-muted-foreground font-medium">or register with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Role selection cards */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Account Type</Label>
          <div className="grid grid-cols-2 gap-3">
            <RoleCard
              active={role === "customer"}
              onClick={() => setRole("customer")}
              icon={<User className="size-5" />}
              title="Customer"
              subtitle="Order hot pizza"
            />
            <RoleCard
              active={role === "vendor"}
              onClick={() => setRole("vendor")}
              icon={<Store className="size-5" />}
              title="Restaurant Vendor"
              subtitle="Sell & manage menu"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name" className="font-semibold text-foreground">Full Name</Label>
          <Input
            id="name"
            placeholder="e.g. John Miller"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 bg-card border-border focus-visible:ring-[#c8402b]"
            required
          />
        </div>

        {role === "vendor" ? (
          <div className="space-y-1.5">
            <Label htmlFor="businessName" className="font-semibold text-foreground">
              Restaurant Name <span className="text-[#c8402b]">*</span>
            </Label>
            <Input
              id="businessName"
              placeholder="e.g. Bella Napoli Woodfire Pizzeria"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="h-11 bg-card border-border focus-visible:ring-[#c8402b]"
              required
            />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-semibold text-foreground">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-card border-border focus-visible:ring-[#c8402b]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="font-semibold text-foreground">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pr-11 bg-card border-border focus-visible:ring-[#c8402b]"
              required
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

          {/* Interactive password rule checklist */}
          <div className="rounded-lg border border-border/80 bg-muted/40 p-2.5 text-[11px] space-y-1">
            <p className="font-semibold text-muted-foreground mb-1">Password Requirements:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
              <span className={cn("flex items-center gap-1 font-medium", hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                {hasMinLength ? <Check className="size-3 text-emerald-600" /> : <X className="size-3 text-muted-foreground/60" />}
                6+ Characters
              </span>
              <span className={cn("flex items-center gap-1 font-medium", hasUppercase ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                {hasUppercase ? <Check className="size-3 text-emerald-600" /> : <X className="size-3 text-muted-foreground/60" />}
                1 Uppercase (A-Z)
              </span>
              <span className={cn("flex items-center gap-1 font-medium", hasLowercase ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                {hasLowercase ? <Check className="size-3 text-emerald-600" /> : <X className="size-3 text-muted-foreground/60" />}
                1 Lowercase (a-z)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="image" className="font-semibold text-foreground">
            Profile Image URL <span className="font-normal text-muted-foreground">(optional, can be skipped)</span>
          </Label>
          <Input
            id="image"
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="h-11 bg-card border-border focus-visible:ring-[#c8402b]"
          />
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
          {loading ? "Creating account…" : `Create ${role === "vendor" ? "Vendor" : "Customer"} Account`}
        </Button>

        <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          By signing up, you agree to PizzaHub terms &amp; conditions.
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-[#c8402b] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
        active
          ? "border-[#c8402b] bg-[#c8402b]/10 ring-2 ring-[#c8402b]/30 shadow-xs"
          : "border-border bg-card hover:bg-muted/60"
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
          active ? "bg-[#c8402b] text-white shadow-xs" : "bg-orange-100 text-[#a3542f] dark:bg-stone-800 dark:text-orange-400"
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{subtitle}</span>
      </span>
      {active ? (
        <span className="absolute top-2 right-2 grid size-4 place-items-center rounded-full bg-[#c8402b] text-white">
          <Check className="size-2.5" />
        </span>
      ) : null}
    </button>
  );
}
