import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#0d0705] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand & Description */}
        <div className="space-y-4">
          <BrandLogo />
          <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-neutral-400">
            Hand-tossed pizza, honest ingredients and doorstep delivery. Serving happiness
            one slice at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f43f5e]">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/menu" className="transition-colors hover:text-white">
                Browse Menu
              </Link>
            </li>
            <li>
              <Link href="/favorites" className="transition-colors hover:text-white">
                Favorites
              </Link>
            </li>
            <li>
              <Link href="/sign-in" className="transition-colors hover:text-white">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="transition-colors hover:text-white">
                Create Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f43f5e]">
            Support
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
            <li>
              <Link href="/#why-choose" className="transition-colors hover:text-white">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="transition-colors hover:text-white">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link href="/profile" className="transition-colors hover:text-white">
                Customer Information
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="transition-colors hover:text-white">
                Become a Vendor
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f43f5e]">
            Contact Us
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-neutral-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#f43f5e]" />
              <span>123 Crust Street, Naples, FL 34101</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-[#f43f5e]" />
              <span>+1 (555) 762-5432</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-[#f43f5e]" />
              <span>hello@pizzahub.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5">
        <p className="px-4 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} PizzaHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
