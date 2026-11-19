"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Store, User } from "lucide-react";
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
  const [image, setImage] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [role, setRole] = useState<RoleChoice>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#3b1c12]">Create your account</h1>
        <p className="text-sm text-[#7a5c4d]">Order delicious pizza or grow your restaurant.</p>
      </div>

      <GoogleButton onClick={handleGoogle} disabled={loading} label="Continue with Google" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#ecd9c6]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-[#fffaf3] px-3 text-[#a18573]">or sign up with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Role selection */}
        <div className="grid grid-cols-2 gap-3">
          <RoleCard
            active={role === "customer"}
            onClick={() => setRole("customer")}
            icon={<User className="size-5" />}
            title="Customer"
            subtitle="Order pizza"
          />
          <RoleCard
            active={role === "vendor"}
            onClick={() => setRole("vendor")}
            icon={<Store className="size-5" />}
            title="Vendor"
            subtitle="Sell pizza"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Jane Doe"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 bg-white"
            required
          />
        </div>

        {role === "vendor" ? (
          <div className="space-y-1.5">
            <Label htmlFor="businessName">Restaurant Name</Label>
            <Input
              id="businessName"
              placeholder="Slice of Naples"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="h-11 bg-white"
              required
            />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-white"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 6 chars, 1 uppercase, 1 lowercase"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 bg-white"
            required
          />
          <p className="text-xs text-[#a18573]">At least 6 characters with one uppercase and one lowercase letter.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="image">
            Profile Image <span className="font-normal text-[#a18573]">(optional)</span>
          </Label>
          <Input
            id="image"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
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
          {loading ? "Creating account…" : "Sign Up"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#7a5c4d]">
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
        "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
        active
          ? "border-[#c8402b] bg-[#fff1e8] ring-2 ring-[#c8402b]/20"
          : "border-[#ecd9c6] bg-white hover:border-[#d9b99e]"
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full",
          active ? "bg-[#c8402b] text-white" : "bg-[#f7ecdf] text-[#a3542f]"
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#3b1c12]">{title}</span>
        <span className="block text-xs text-[#a18573]">{subtitle}</span>
      </span>
    </button>
  );
}
