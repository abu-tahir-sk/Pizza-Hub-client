import Link from "next/link";
import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export function BrandLogo({
  href = "/",
  className,
  size = "md",
  showSubtitle = true,
}: BrandLogoProps) {
  const iconSizes = {
    sm: "size-9 rounded-xl",
    md: "size-11 rounded-2xl",
    lg: "size-12 rounded-2xl",
  };

  const svgSizes = {
    sm: "size-5 stroke-[2]",
    md: "size-6 stroke-[2.2]",
    lg: "size-6.5 stroke-[2.2]",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const content = (
    <div className={cn("flex items-center gap-2.5 sm:gap-3 group shrink-0", className)}>
      <span
        className={cn(
          "grid place-items-center bg-[#d4432d] text-white shadow-md shadow-[#d4432d]/25 transition-transform group-hover:scale-105 shrink-0",
          iconSizes[size]
        )}
      >
        <Pizza className={cn("text-white", svgSizes[size])} />
      </span>
      <div className="flex flex-col">
        <div className={cn("flex items-center font-extrabold tracking-tight leading-none", textSizes[size])}>
          <span className="text-neutral-900 dark:text-white">Pizza</span>
          <span className="text-[#f19d38]">Hub</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase mt-1 leading-none">
            FRESH & FAST
          </span>
        )}
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex focus:outline-none">
      {content}
    </Link>
  );
}
