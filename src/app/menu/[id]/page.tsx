"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Loader2,
  MapPin,
  MessageSquare,
  Minus,
  Pizza,
  Plus,
  Send,
  ShieldCheck,
  Star,
  Store,
  Truck,
} from "lucide-react";
import type { MenuItem } from "@/types";
import type { AppUser } from "@/lib/types";
import { fetchMenuItemById, placeOrder, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useFavorites } from "@/context/favorites-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuItemPage() {
  return (
    <AuthGuard>
      <ItemDetails />
    </AuthGuard>
  );
}

function ItemDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as unknown as AppUser | undefined;
  const { isFavorite, toggleFavorite } = useFavorites();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [reviews, setReviews] = useState<{ id: string; name: string; rating: number; comment: string; date: string }[]>([
    {
      id: "r1",
      name: "Alex Morgan",
      rating: 5,
      comment: "The crust blistering and sourdough aroma are incredible! Arrived steaming hot in 22 minutes.",
      date: "Yesterday",
    },
    {
      id: "r2",
      name: "Sophia Chen",
      rating: 5,
      comment: "Generous cheese pull, fresh organic basil, and perfectly balanced tomato sauce. A new favorite!",
      date: "3 days ago",
    },
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    const rev = {
      id: `rev_${Date.now()}`,
      name: user?.name ?? "Friendly Customer",
      rating: newRating,
      comment: newComment.trim(),
      date: "Just now",
    };
    setReviews([rev, ...reviews]);
    setNewComment("");
    toast.success("Thank you for your review!");
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchMenuItemById(params.id);
        if (!cancelled) {
          if (!data || data.status !== "approved") setNotFound(true);
          else setItem(data);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function handleOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!item) return;
    setSubmitting(true);
    try {
      const order = await placeOrder({
        itemId: item._id,
        deliveryDate: new Date(deliveryDate).toISOString(),
        deliveryAddress: address,
        message,
        quantity,
      });

      try {
        confetti({
          particleCount: 85,
          spread: 65,
          origin: { y: 0.65 },
        });
      } catch {
        // ignore
      }
      toast.success("Order placed successfully! Cash on delivery.");
      router.push(`/dashboard/customer/orders?highlight=${order._id}`);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Could not place your order. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Skeleton className="h-96 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-orange-500/10 text-[#f43f5e]">
          <Pizza className="size-10" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">Menu item not found</h1>
        <p className="mt-2 text-muted-foreground">
          This item may have been removed, rejected, or the link is invalid.
        </p>
        <Button asChild className="mt-6 bg-[#f43f5e] hover:bg-[#e11d48]">
          <Link href="/menu">Back to menu</Link>
        </Button>
      </div>
    );
  }

  const vendor = typeof item.vendorId === "object" ? item.vendorId : null;
  const vendorName = vendor?.businessName || vendor?.name || "PizzaHub Vendor";
  const isOwner = vendor?._id != null && vendor._id === user?.id;
  const isCustomer = user?.role === "customer";
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button asChild variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/menu">
              <ArrowLeft className="size-4" /> Back to menu
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <div className="relative h-80 overflow-hidden rounded-xl border border-border bg-muted dark:bg-stone-800 sm:h-[420px]">
              <Image
                src={item.images[activeImage] ?? item.images[0]}
                alt={item.itemName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {vendor?.subscriptionPlan === "premium" ? (
                <Badge className="absolute left-4 top-4 bg-[#f43f5e] text-white">
                  <Star className="size-3 fill-current" /> Premium Vendor
                </Badge>
              ) : null}

              <button
                type="button"
                onClick={() => toggleFavorite(item._id, item.itemName)}
                aria-label={isFavorite(item._id) ? "Remove from favorites" : "Add to favorites"}
                className={`absolute right-4 top-4 grid size-10 place-items-center rounded-full backdrop-blur transition-all ${
                  isFavorite(item._id)
                    ? "bg-[#f43f5e] text-white shadow"
                    : "bg-background/80 text-foreground border border-border hover:bg-background hover:text-[#f43f5e]"
                }`}
              >
                <Heart className={`size-5 ${isFavorite(item._id) ? "fill-current" : ""}`} />
              </button>
            </div>
            {item.images.length > 1 ? (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {item.images.map((img, index) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      index === activeImage ? "border-[#f43f5e]" : "border-transparent"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image src={img} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>

          {/* Info + order */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <Badge variant="secondary">{item.category}</Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {item.itemName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Store className="size-4" /> {vendorName}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" /> {item.location}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-[#f43f5e]">{formatPrice(item.price)}</p>
              <p className="leading-relaxed text-muted-foreground">{item.description}</p>
            </div>

            <Card className="border-border bg-card">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-[#f43f5e]" />
                  <h2 className="text-lg font-bold text-foreground">Place your order</h2>
                </div>

                {user?.role === "admin" ? (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4 text-sm text-amber-800 dark:text-amber-300">
                    Admin accounts cannot place customer orders.
                  </div>
                ) : isOwner ? (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4 text-sm text-amber-800 dark:text-amber-300">
                    This is your own menu item — vendors cannot order their own items.
                  </div>
                ) : (
                  <form onSubmit={handleOrder} className="space-y-4">
                    {/* Quantity Picker */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">Quantity</Label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-border bg-card">
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                            className="grid size-10 place-items-center rounded-l-lg hover:bg-muted disabled:opacity-40 transition-colors"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="w-12 text-center text-base font-bold text-foreground">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                            disabled={quantity >= 10}
                            className="grid size-10 place-items-center rounded-r-lg hover:bg-muted disabled:opacity-40 transition-colors"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatPrice(item.price)} each
                        </span>
                      </div>
                    </div>

                    {/* Delivery Date */}
                    <div className="space-y-1.5">
                      <Label htmlFor="deliveryDate">Delivery Date</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        min={today}
                        required
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-1.5">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Input
                        id="address"
                        required
                        minLength={5}
                        placeholder="House 12, Road 4, Gulshan, Dhaka"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    {/* Additional Message / Special Instructions */}
                    <div className="space-y-1.5">
                      <Label htmlFor="message">
                        Additional Message / Special Instructions <span className="font-normal text-muted-foreground">(optional)</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Extra cheese, no olives, ring the bell twice…"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={500}
                        rows={2}
                      />
                    </div>

                    {/* Order Button (Cash on Delivery / Order Confirmation) */}
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-12 w-full bg-[#f43f5e] text-base hover:bg-[#e11d48] shadow-sm font-bold cursor-pointer"
                    >
                      {submitting ? (
                        <Loader2 className="size-5 animate-spin mr-2" />
                      ) : (
                        <Truck className="size-5 mr-2" />
                      )}
                      {submitting ? "Processing…" : `Place Order (${formatPrice(item.price * quantity)})`}
                    </Button>

                    <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground text-center">
                      <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                      No prepayment required — pay cash upon arrival.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ─── Customer Reviews & Ratings (Optional Requirement) ─── */}
        <section className="mt-14 space-y-6 border-t border-border pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-amber-400 text-amber-500" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Customer Reviews &amp; Ratings
                </h2>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Read authentic feedback from fellow pizza lovers or submit your own.
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-300">
              <Star className="size-3.5 fill-current text-amber-500" /> 4.9 · Highly Rated
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Reviews List */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 lg:col-span-7"
            >
              {reviews.map((rev) => (
                <Card key={rev.id} className="border-border bg-card">
                  <CardContent className="space-y-2 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-full bg-orange-100 text-xs font-bold text-[#f43f5e] dark:bg-stone-800 dark:text-orange-400">
                          {rev.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-foreground">{rev.name}</p>
                          <p className="text-[11px] text-muted-foreground">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{rev.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Leave a review form */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <Card className="border-border bg-card">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-4 text-[#f43f5e]" />
                    <h3 className="font-bold text-foreground">Leave a Review</h3>
                  </div>
                  <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <Label className="text-xs">Your Rating</Label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewRating(s)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`size-6 ${
                                s <= newRating ? "fill-amber-400 text-amber-400" : "text-stone-300 dark:text-stone-600"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="reviewText" className="text-xs">Your Experience</Label>
                      <Textarea
                        id="reviewText"
                        required
                        rows={3}
                        placeholder="Tell others about the crust, sauce, freshness and delivery speed…"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                    </div>

                    <Button type="submit" size="sm" className="bg-[#f43f5e] hover:bg-[#e11d48]">
                      <Send className="size-3.5" /> Submit Review
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
