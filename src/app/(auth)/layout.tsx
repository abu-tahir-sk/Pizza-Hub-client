import Link from "next/link";
import { Pizza } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-[#8f1d14] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7a150d]/90 via-[#8f1d14]/80 to-[#b4451f]/70" />

        <Link href="/" className="relative z-10 flex items-center gap-2.5 text-white">
          <span className="grid size-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/30">
            <Pizza className="size-5" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            Pizza<span className="text-amber-300">Hub</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-md space-y-5">
          <h2 className="text-4xl font-extrabold leading-tight text-white">
            Freshly baked. <br /> Delivered to your door.
          </h2>
          <p className="text-base leading-relaxed text-amber-50/90">
            Join thousands of pizza lovers discovering local shops, or grow your restaurant with a
            free vendor profile.
          </p>
          <div className="flex items-center gap-6 text-sm text-amber-50/80">
            <span>🍕 120+ menu items</span>
            <span>🚚 Fast delivery</span>
          </div>
        </div>

        <p className="relative z-10 text-xs text-amber-100/60">
          © {new Date().getFullYear()} PizzaHub. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-[#fffaf3] px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
