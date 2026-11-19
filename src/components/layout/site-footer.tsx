import Link from "next/link";
import { Mail, MapPin, Phone, Pizza } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#3a1810] bg-[#2b120c] text-[#f6e7d7]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-full bg-[#c8402b] text-white">
              <Pizza className="size-5" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              Pizza<span className="text-[#f0a23c]">Hub</span>
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-[#d9bfae]">
            Discover local pizza shops, explore fresh menus, and get hot &amp; delicious pizza
            delivered to your door.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#f0a23c]">Explore</h3>
          <ul className="space-y-2.5 text-sm text-[#d9bfae]">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/menu" className="hover:text-white">Browse Menu</Link></li>
            <li><Link href="/sign-in" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/sign-up" className="hover:text-white">Become a Vendor</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#f0a23c]">Contact</h3>
          <ul className="space-y-3 text-sm text-[#d9bfae]">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#f0a23c]" />
              42 Crust Street, Naples District
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-[#f0a23c]" />
              +1 (555) 010-4242
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-[#f0a23c]" />
              hello@pizzahub.com
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#f0a23c]">Follow Us</h3>
          <div className="flex items-center gap-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="PizzaHub on X"
              className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-[#c8402b]"
            >
              {/* X (formerly Twitter) logo */}
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="PizzaHub on Instagram"
              className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-[#c8402b]"
            >
              {/* Instagram glyph */}
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07Zm0 1.98c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.18.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.18-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.4 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.18.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.18-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.18.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.4-2.18a3.63 3.63 0 0 0-.88-1.35 3.63 3.63 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.18-.4-1.24-.06-1.61-.07-4.76-.07Zm0 3.37a5.49 5.49 0 1 1 0 10.98 5.49 5.49 0 0 1 0-10.98Zm0 1.98a3.51 3.51 0 1 0 0 7.02 3.51 3.51 0 0 0 0-7.02Zm5.71-3.5a1.28 1.28 0 1 1-2.56 0 1.28 1.28 0 0 1 2.56 0Z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="PizzaHub on YouTube"
              className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-[#c8402b]"
            >
              {/* YouTube glyph */}
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
              </svg>
            </a>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#a98874]">
            Open daily: 11:00 AM – 11:00 PM
            <br />
            Delivery within 30 minutes.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-[#a98874]">
          © {new Date().getFullYear()} PizzaHub. All rights reserved. Made with 🍕 and care.
        </p>
      </div>
    </footer>
  );
}
