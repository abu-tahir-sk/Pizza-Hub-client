"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarClock,
  Loader2,
  Lock,
  Mail,
  Save,
  Store,
  Upload,
  UserRound,
} from "lucide-react";
import type { AppUser } from "@/lib/types";
import { fetchMyProfile, updateProfile, uploadMenuImage, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { AuthGuard } from "@/components/auth/auth-guard";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { refetch } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [role, setRole] = useState<AppUser["role"]>("customer");
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const me = await fetchMyProfile();
        if (cancelled) return;
        setName(me.name ?? "");
        setImage(me.image ?? null);
        setBusinessName(me.businessName ?? "");
        setRole(me.role);
        setPlan(me.subscriptionPlan ?? "free");
        setExpiresAt(me.subscriptionExpiresAt ?? null);
        setEmail(me.email);
        setJoined(me.createdAt);
        setError(null);
      } catch {
        if (!cancelled) setError("Could not load your profile. Please refresh the page.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleImageSelected(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast.error("Please choose an image up to 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadMenuImage(file);
      setImage(url);
      toast.success("Image uploaded — remember to save your profile.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not upload this image");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        image,
        ...(role === "vendor" ? { businessName: businessName.trim() } : {}),
      });
      toast.success("Profile updated successfully");
      void refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update your profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-5 px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee]">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <ProfileHeading role={role} />

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="border-[#efe1d0]">
            <CardHeader>
              <CardTitle className="text-base">Personal information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center gap-4">
                <span className="relative size-20 overflow-hidden rounded-full border-2 border-[#f0e2d2] bg-[#fdeade]">
                  {image ? (
                    <Image src={image} alt={name || "Profile"} fill sizes="80px" className="object-cover" />
                  ) : (
                    <span className="grid size-full place-items-center text-2xl font-bold text-[#c8402b]">
                      {(name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <div className="space-y-1.5">
                  <label
                    htmlFor="profile-image"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d9b99e] bg-white px-3 py-2 text-xs font-semibold text-[#3b1c12] transition-colors hover:bg-[#fbf2e7]"
                  >
                    {uploading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Upload className="size-3.5" />
                    )}
                    {uploading ? "Uploading…" : "Change photo"}
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => void handleImageSelected(e.target.files?.[0])}
                    />
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    JPG or PNG, up to 5 MB. Uploaded via ImgBB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={60}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a18573]" />
                  <Input id="email" value={email} readOnly disabled className="h-11 pl-9" />
                </div>
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Lock className="size-3" /> Email changes are disabled for account security.
                </p>
              </div>

              {role === "vendor" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="businessName">Business name</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a18573]" />
                    <Input
                      id="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Napoli Wood-Fired Pizza"
                      maxLength={100}
                      className="h-11 pl-9"
                    />
                  </div>
                </div>
              ) : null}

              <Button type="submit" disabled={saving} className="h-11 w-full bg-[#c8402b] hover:bg-[#ad3521]">
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Read-only account info */}
          <div className="space-y-6">
            <Card className="border-[#efe1d0]">
              <CardHeader>
                <CardTitle className="text-base">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <UserRound className="size-4" /> Role
                  </span>
                  <Badge
                    variant={role === "admin" ? "success" : role === "vendor" ? "warning" : "muted"}
                    className="capitalize"
                  >
                    {role === "admin" ? <BadgeCheck className="size-3" /> : null}
                    {role}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Subscription</span>
                  {role === "vendor" ? (
                    <Badge variant={plan === "premium" ? "success" : "secondary"} className="capitalize">
                      {plan}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not applicable</span>
                  )}
                </div>
                {expiresAt ? (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <CalendarClock className="size-4" /> Renews
                      </span>
                      <span className="text-xs font-medium">{formatDate(expiresAt)}</span>
                    </div>
                  </>
                ) : null}
                {joined ? (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Member since</span>
                      <span className="text-xs font-medium">{formatDate(joined)}</span>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-[#efe1d0] bg-[#fdf7ef]">
              <CardContent className="space-y-2 p-5 text-xs leading-relaxed text-[#7a5c4d]">
                <p className="flex items-center gap-1.5 font-semibold text-[#3b1c12]">
                  <Lock className="size-3.5 text-[#c8402b]" /> Security note
                </p>
                <p>
                  Your role and subscription are managed by PizzaHub and cannot be changed here. A
                  Premium plan activates only after Stripe confirms your payment via a verified
                  webhook.
                </p>
                {role === "vendor" ? (
                  <p>
                    Manage your plan from the{" "}
                    <Link href="/dashboard/vendor/subscription" className="font-semibold underline">
                      subscription page
                    </Link>
                    .
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileHeading({ role }: { role: AppUser["role"] }) {
  return (
    <div className="space-y-4">
      <PageHeading
        title="Profile Settings"
        description="Update your personal information. Role and billing details are read-only."
      />
      <Button asChild variant="ghost" size="sm" className="-mt-2 -ml-2 text-[#7a5c4d]">
        <Link href={role === "admin" ? "/dashboard/admin" : role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer"}>
          Back to dashboard
        </Link>
      </Button>
    </div>
  );
}
