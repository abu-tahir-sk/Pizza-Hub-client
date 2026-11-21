import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#070707] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#c67c4e] selection:text-white">
      {/* Background pizza for mobile screens */}
      <div
        className="fixed inset-0 lg:hidden bg-cover bg-center pointer-events-none opacity-30 mix-blend-screen"
        style={{
          backgroundImage: "url('/images/auth-pizza-mobile.jpg')",
        }}
      />

      {/* Top Header Bar with "< BACK TO THE WEBSITE" */}
      <header className="relative z-20 w-full px-6 py-6 sm:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-[#c67c4e]/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#c67c4e] transition-all hover:bg-[#c67c4e]/15 hover:border-[#c67c4e]"
        >
          <ChevronLeft className="size-3.5" />
          <span>BACK TO THE WEBSITE</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8">
        {/* Left Side: Artisan Pizza (Desktop only) */}
        <div className="relative hidden lg:flex items-center justify-start h-full lg:col-span-6 overflow-hidden select-none pointer-events-none">
          <div className="relative w-full max-w-[580px] aspect-[4/5] flex items-center justify-start">
            <img
              src="/images/auth-pizza-desktop.jpg"
              alt="Artisanal Pizza"
              className="w-[210%] max-w-none h-full object-cover object-left"
              style={{
                maskImage:
                  "linear-gradient(to right, black 0%, black 45%, transparent 52%)",
                WebkitMaskImage:
                  "linear-gradient(to right, black 0%, black 45%, transparent 52%)",
              }}
            />
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="w-full lg:col-span-6 flex items-center justify-center lg:justify-start lg:pl-8">
          <div className="w-full max-w-md bg-[#0e0e0e]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-6 sm:p-8 rounded-2xl lg:rounded-none border border-white/10 lg:border-none shadow-2xl lg:shadow-none">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Footer with "< BACK TO THE WEBSITE" */}
      <footer className="relative z-20 flex justify-center pb-8 pt-4 lg:hidden px-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 w-full max-w-xs rounded-md border border-[#c67c4e]/70 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#c67c4e] transition-all hover:bg-[#c67c4e]/15 hover:border-[#c67c4e]"
        >
          <ChevronLeft className="size-3.5" />
          <span>BACK TO THE WEBSITE</span>
        </Link>
      </footer>
    </div>
  );
}
