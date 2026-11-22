import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

const PLATFORM_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
  { label: "Favorites", href: "/favorites" },
  { label: "Dashboard", href: "/dashboard" },
];

const COMPANY_LINKS = [
  { label: "Why PizzaHub", href: "/#why-choose" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Become a Vendor", href: "/sign-up" },
  { label: "Create Account", href: "/sign-up" },
];

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  );
}

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
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="PizzaHub on X"
              className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:border-[#f43f5e]/50 hover:bg-[#f43f5e]/15 hover:text-white"
            >
              <XLogo className="size-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="PizzaHub on Instagram"
              className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:border-[#f43f5e]/50 hover:bg-[#f43f5e]/15 hover:text-white"
            >
              <InstagramLogo className="size-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="PizzaHub on Facebook"
              className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:border-[#f43f5e]/50 hover:bg-[#f43f5e]/15 hover:text-white"
            >
              <FacebookLogo className="size-4" />
            </a>
          </div>
        </div>

        {/* Platform */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f43f5e]">
            Platform
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
            {PLATFORM_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f43f5e]">
            Company
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get in touch */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f43f5e]">
            Get in touch
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
              <a href="mailto:hello@pizzahub.com" className="transition-colors hover:text-white">
                hello@pizzahub.com
              </a>
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
