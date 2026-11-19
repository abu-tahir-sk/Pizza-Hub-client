import Link from "next/link";
import { ChefHat, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fffaf3] px-4 py-20 text-center">
      <span className="grid size-20 place-items-center rounded-full bg-[#fdeade] text-[#c8402b]">
        <ChefHat className="size-10" />
      </span>
      <p className="mt-6 text-6xl font-extrabold tracking-tight text-[#3b1c12]">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-[#3b1c12] sm:text-3xl">
        This slice is missing
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#7a5c4d]">
        The page you&apos;re looking for may have been moved, removed, or never existed. Let&apos;s get
        you back to something delicious.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="bg-[#c8402b] hover:bg-[#ad3521]">
          <Link href="/">
            <Home className="size-4" /> Back home
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-[#d9b99e]">
          <Link href="/menu">
            <Search className="size-4" /> Browse menu
          </Link>
        </Button>
      </div>
    </div>
  );
}
