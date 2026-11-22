"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Pizza,
  ShieldCheck,
  Store,
  Upload,
  X,
} from "lucide-react";
import type { User } from "@/types";
import { MENU_CATEGORIES } from "@/lib/types";
import {
  createMenuItem,
  uploadMenuImage,
  fetchAdminUsers,
  ApiError,
} from "@/lib/api";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AdminAddMenuItemPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<string>("approved");
  const [selectedVendorId, setSelectedVendorId] = useState<string>("admin");

  const [vendors, setVendors] = useState<User[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<string>("");

  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await fetchAdminUsers({ role: "vendor", limit: 100 });
        setVendors(res.users);
      } catch {
        // Vendors optional: can always publish under admin
      } finally {
        setLoadingVendors(false);
      }
    }
    void loadVendors();
  }, []);

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const picked = Array.from(list).slice(0, 3);
    const valid = picked.filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
    );
    if (valid.length !== picked.length) {
      toast.error("Only images up to 5 MB are allowed.");
    }
    setFiles(valid);
    setPreviews(valid.map((f) => URL.createObjectURL(f)));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please upload at least one item image.");
      return;
    }
    setSubmitting(true);
    try {
      setStage("Uploading images to ImgBB…");
      const images: string[] = [];
      for (const file of files) {
        images.push(await uploadMenuImage(file));
      }

      setStage("Publishing menu item…");
      await createMenuItem({
        itemName: name.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images,
        vendorId: selectedVendorId === "admin" ? undefined : selectedVendorId,
        status,
      });

      toast.success(
        status === "approved"
          ? "Pizza added and published to the menu!"
          : "Pizza added successfully!"
      );
      router.push("/dashboard/admin/items");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not add the item. Please check your inputs and try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
      setStage("");
    }
  }

  return (
    <div className="space-y-6">
      <Button
        asChild
        variant="ghost"
        className="-ml-2 text-muted-foreground hover:text-foreground"
      >
        <Link href="/dashboard/admin/items">
          <ArrowLeft className="size-4" /> Back to menu items
        </Link>
      </Button>

      <PageHeading
        title="Add New Pizza"
        description="Upload and publish a new pizza or menu item directly to the platform as an Administrator."
      />

      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-[#f43f5e]" />
        <div>
          <span className="font-semibold">Administrator Privilege:</span> Items created here can be published immediately without requiring separate approval, or assigned directly to a registered restaurant partner.
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Truffle Mushroom & Prosciutto"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MENU_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Initial Status *</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">
                        Approved (Visible immediately)
                      </SelectItem>
                      <SelectItem value="pending">
                        Pending review
                      </SelectItem>
                      <SelectItem value="inactive">
                        Inactive (Hidden)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vendorSelect">Assign to Restaurant / Vendor</Label>
                <Select
                  value={selectedVendorId}
                  onValueChange={setSelectedVendorId}
                  disabled={loadingVendors}
                >
                  <SelectTrigger id="vendorSelect">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <span className="flex items-center gap-2">
                        <Pizza className="size-4 text-[#f43f5e]" />
                        <span>PizzaHub Official (Platform Admin)</span>
                      </span>
                    </SelectItem>
                    {vendors.map((v) => {
                      const vendorId = v._id || v.id;
                      return (
                        <SelectItem key={vendorId} value={vendorId}>
                          <span className="flex items-center gap-2">
                            <Store className="size-4 text-muted-foreground" />
                            <span>{v.businessName || v.name} ({v.email})</span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  You can assign this pizza to a specific vendor, or list it under PizzaHub Official.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Artisanal sourdough crust, smoked mozzarella, roasted portobello mushrooms, white truffle oil, and micro basil."
                  required
                  minLength={10}
                  maxLength={1000}
                  className="min-h-28"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="18.99"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location (area / city) *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Downtown, New York"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-3">
              <Label>
                Item Images *{" "}
                <span className="font-normal text-muted-foreground">
                  (1–3 files, max 5 MB each)
                </span>
              </Label>

              <label
                htmlFor="images"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <ImagePlus className="size-9 text-[#f43f5e]" />
                <span className="text-sm font-semibold text-foreground">
                  Click to upload pizza photos
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, or WEBP · uploaded securely via ImgBB
                </span>
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFilesSelected(e.target.files)}
                />
              </label>

              {previews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((src, index) => (
                    <div
                      key={src}
                      className="relative h-24 overflow-hidden rounded-lg border border-border"
                    >
                      <Image
                        src={src}
                        alt={`Preview ${index + 1}`}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
                        aria-label="Remove image"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                Images are automatically processed and hosted via ImgBB. As an admin, uploaded items can appear directly on the public menu when status is set to Approved.
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="h-11 w-full bg-[#f43f5e] hover:bg-[#e11d48] text-white"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {submitting
                  ? stage || "Publishing…"
                  : status === "approved"
                  ? "Create & Publish Pizza"
                  : "Save Pizza Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
