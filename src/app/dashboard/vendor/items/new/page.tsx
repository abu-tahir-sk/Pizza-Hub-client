"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { MENU_CATEGORIES, type AppUser } from "@/lib/types";
import { createMenuItem, uploadMenuImage, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { PageHeading } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AddMenuItemPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as unknown as AppUser | undefined;
  const isPremium = user?.subscriptionPlan === "premium";

  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<string>("");

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const picked = Array.from(list).slice(0, 3);
    const valid = picked.filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
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

      setStage("Saving your menu item…");
      await createMenuItem({
        itemName: name.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images,
      });

      toast.success("Menu item submitted — it's pending admin approval.");
      router.push("/dashboard/vendor/items");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not add the item. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
      setStage("");
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-2 text-[#7a5c4d]">
        <Link href="/dashboard/vendor/items">
          <ArrowLeft className="size-4" /> Back to menu items
        </Link>
      </Button>

      <PageHeading
        title="Add Menu Item"
        description="New items are reviewed by an admin before they appear on the public menu."
      />

      {!isPremium ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Free plan:</strong> you can publish a maximum of 3 active items.{" "}
          <Link href="/dashboard/vendor/subscription" className="font-semibold underline">
            Upgrade to Premium
          </Link>{" "}
          for unlimited listings.
        </div>
      ) : null}

      <Card className="border-[#efe1d0]">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Margherita Classica"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="San Marzano tomato, fresh mozzarella, basil, extra virgin olive oil."
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
                    placeholder="14.99"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location (area / city) *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Gulshan, Dhaka"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-3">
              <Label>Item Images * <span className="font-normal text-muted-foreground">(1–3 files, max 5 MB each)</span></Label>

              <label
                htmlFor="images"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e3cdb6] bg-[#fdf7ef] px-4 py-10 text-center transition-colors hover:border-[#c8402b]/50 hover:bg-[#fbeede]"
              >
                <ImagePlus className="size-9 text-[#c8402b]" />
                <span className="text-sm font-semibold text-[#3b1c12]">
                  Click to upload images
                </span>
                <span className="text-xs text-[#a18573]">
                  PNG or JPG · uploaded securely via ImgBB
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
                    <div key={src} className="relative h-24 overflow-hidden rounded-lg border">
                      <Image src={src} alt={`Preview ${index + 1}`} fill sizes="120px" className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-black/60 text-white"
                        aria-label="Remove image"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="rounded-lg bg-[#f7f1e9] p-3 text-xs leading-relaxed text-[#7a5c4d]">
                Item images are required. The ImgBB API key lives on the server, so it is never
                exposed in the browser.
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="h-11 w-full bg-[#c8402b] hover:bg-[#ad3521]"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {submitting ? stage || "Submitting…" : "Submit for approval"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
