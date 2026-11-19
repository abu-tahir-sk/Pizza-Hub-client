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
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <ProfileContent />
      </DashboardShell>
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
    <div className="space-y-6 pb-12">
      <PageHeading
        title="Profile Settings"
        description="Manage your account info, avatar and preferences."
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Personal information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <span className="relative size-20 overflow-hidden rounded-full border-2 border-border bg-muted">
                {image ? (
                  <Image src={image} alt={name || "Profile"} fill sizes="80px" className="object-cover" />
                ) : (
                  <span className="grid size-full place-items-center text-lg font-semibold text-muted-foreground">
                    {(name || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </span>

              <div className="space-y-2">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageSelected(e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 size-4" /> Change avatar
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP up to 5MB.</p>
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={60}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{email}</span>
                <span className="ml-auto text-xs text-muted-foreground">(Cannot change)</span>
              </div>
            </div>

            {role === "vendor" ? (
              <div className="space-y-2">
                <Label htmlFor="businessName">Restaurant / Business Name</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    className="pl-9"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Mario's Pizzeria"
                    required
                    maxLength={80}
                  />
                </div>
              </div>
            ) : null}

            <Button type="submit" disabled={saving || uploading} className="bg-[#c8402b] text-white hover:bg-[#b03523]">
              {saving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" /> Save changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Account status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="secondary" className="capitalize">
                  {role}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium text-foreground">{joined ? formatDate(joined) : "—"}</span>
              </div>

              {role === "vendor" ? (
                <>
                  <Separator className="bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subscription plan</span>
                    <Badge
                      className={
                        plan === "premium"
                          ? "bg-[#f0a23c] text-[#3b1c12]"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {plan === "premium" ? "Premium" : "Free"}
                    </Badge>
                  </div>
                  {expiresAt ? (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Renews / Expires</span>
                      <span className="font-medium text-foreground">{formatDate(expiresAt)}</span>
                    </div>
                  ) : null}
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Security & Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="size-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Google / Email Auth secured</p>
                  <p className="text-xs">Your credentials are protected with secure hashing and tokens.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

function ProfileHeading({ role }: { role: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account info, avatar and settings.
        </p>
      </div>
      <div>
        <Link
          href={role === "admin" ? "/dashboard/admin" : role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer"}
          className="inline-flex items-center text-sm font-medium text-[#c8402b] hover:underline"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
