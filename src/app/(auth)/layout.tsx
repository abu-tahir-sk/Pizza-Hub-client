import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#070707] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#c67c4e] selection:text-white">
      {/* Background pizza image for mobile / tablet screens */}
      <div className="fixed inset-0 lg:hidden pointer-events-none select-none z-0">
        <Image
          src="/images/auth-pizza-desktop.jpg"
          alt="Artisanal Pizza Background"
          fill
          priority
          className="object-cover object-center opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/90 via-[#070707]/75 to-[#070707]/95" />
      </div>

      {/* Top Header Bar with "< BACK TO THE WEBSITE" */}
      <header className="relative z-20 w-full px-6 py-6 sm:px-10 lg:px-16 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-sm border border-[#c67c4e]/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#c67c4e] transition-all hover:bg-[#c67c4e]/15 hover:border-[#c67c4e] active:scale-95 shadow-xs"
        >
          <ChevronLeft className="size-3.5 stroke-[2.5]" />
          <span>BACK TO THE WEBSITE</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-8 gap-8">
        {/* Left Side: Artisan Pizza (Desktop view matching mockup) */}
        <div className="relative hidden lg:flex items-center justify-center lg:col-span-6 h-full select-none pointer-events-none">
          <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center">
            {/* Subtle warm amber radial glow behind the pizza */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(198,124,78,0.18)_0%,transparent_70%)] blur-2xl" />
            <div className="relative size-[460px] xl:size-[500px] rounded-full overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src="/images/auth-pizza-desktop.jpg"
                alt="Artisanal Neapolitan Pizza with Fresh Basil and Tomatoes"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="w-full lg:col-span-6 flex items-center justify-center lg:justify-start lg:pl-6 xl:pl-10">
          <div className="w-full max-w-[420px] bg-[#0c0c0c]/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-6 sm:p-8 rounded-2xl lg:rounded-none border border-white/10 lg:border-none shadow-2xl lg:shadow-none">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Footer with "< BACK TO THE WEBSITE" */}
      <footer className="relative z-20 flex justify-center pb-8 pt-4 lg:hidden px-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 w-full max-w-xs rounded-sm border border-[#c67c4e]/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#c67c4e] transition-all hover:bg-[#c67c4e]/15 hover:border-[#c67c4e]"
        >
          <ChevronLeft className="size-3.5 stroke-[2.5]" />
          <span>BACK TO THE WEBSITE</span>
        </Link>
      </footer>
    </div>
  );
}
