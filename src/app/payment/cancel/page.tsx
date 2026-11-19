import Link from "next/link";
import { ArrowLeft, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Payment cancelled",
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#fffaf3] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-xl">
        <Card className="border-[#efe1d0] text-center">
          <CardContent className="space-y-4 p-8 sm:p-10">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-100 text-amber-600">
              <XCircle className="size-8" />
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#3b1c12]">
              Checkout cancelled
            </h1>
            <p className="text-sm leading-relaxed text-[#7a5c4d]">
              No payment was taken and your plan has not changed. You can return to the subscription
              page whenever you&apos;re ready to upgrade to Premium.
            </p>

            <div className="mx-auto flex max-w-sm items-start gap-2 rounded-lg bg-[#fdf3e8] p-4 text-left text-xs leading-relaxed text-[#7a5c4d]">
              <CreditCard className="mt-0.5 size-3.5 shrink-0 text-[#c8402b]" />
              <span>
                Premium unlocks unlimited menu items, a Premium badge, and featured placement — it
                activates only after a verified Stripe payment.
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
              <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521]">
                <Link href="/dashboard/vendor/subscription">Try again</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#d9b99e]">
                <Link href="/dashboard/vendor">
                  <ArrowLeft className="size-4" /> Back to dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
