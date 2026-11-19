import Link from "next/link";
import { CheckCircle2, Flame, Pizza, ShieldCheck, Sparkles, Star } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
      {/* Brand panel with artisan pizza imagery & rich typography */}
      <div className="relative hidden overflow-hidden bg-[#2b120c] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0 opacity-30 mix-blend-luminosity scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e0a05] via-[#3b1c12]/95 to-[#c8402b]/60" />

        {/* Ambient glow */}
        <div className="absolute top-1/4 -left-20 size-80 rounded-full bg-[#f0a23c]/20 blur-3xl pointer-events-none" />

        <Link href="/" className="relative z-10 flex items-center gap-2.5 text-white group">
          <span className="grid size-11 place-items-center rounded-full bg-[#c8402b] ring-2 ring-white/20 transition-transform group-hover:scale-105">
            <Pizza className="size-6 text-white" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            Pizza<span className="text-[#f0a23c]">Hub</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200 ring-1 ring-white/20 backdrop-blur-md">
            <Flame className="size-3.5 text-[#f0a23c]" /> Fresh From The Wood-Fired Oven
          </div>

          <h2 className="text-4xl font-extrabold leading-[1.15] text-white sm:text-5xl">
            Authentic pizza, <br />
            <span className="text-[#f0a23c]">delivered piping hot</span> to your door.
          </h2>

          <p className="text-base leading-relaxed text-amber-100/80">
            Join thousands of foodies discovering curated local pizzerias, or list your kitchen and reach hungry pizza lovers across the city.
          </p>

          {/* Social Proof & Feature Pills */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-amber-100/90 font-medium">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Over 50+ local wood-fired &amp; artisan pizza shops</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-amber-100/90 font-medium">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Real customer reviews &amp; live order tracking</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-amber-100/90 font-medium">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Stripe verified instant vendor subscription upgrades</span>
            </div>
          </div>

          {/* Rating Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block size-8 rounded-full ring-2 ring-[#2b120c] bg-orange-500 text-xs font-bold text-white grid place-items-center">M</span>
                <span className="inline-block size-8 rounded-full ring-2 ring-[#2b120c] bg-amber-500 text-xs font-bold text-white grid place-items-center">S</span>
                <span className="inline-block size-8 rounded-full ring-2 ring-[#2b120c] bg-red-600 text-xs font-bold text-white grid place-items-center">A</span>
              </div>
              <span className="text-xs font-semibold text-white/90 pl-1">10,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
              <Star className="size-3.5 fill-[#f0a23c] text-[#f0a23c]" />
              <span>4.9 / 5.0</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-amber-100/60 border-t border-white/10 pt-4">
          <p>© {new Date().getFullYear()} PizzaHub Platform</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            End-to-end encrypted
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background text-foreground px-4 py-12 sm:px-8 transition-colors">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
