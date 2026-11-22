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
  showSubtitle = false,
}: BrandLogoProps) {
  const iconSizes = {
    sm: "size-8 rounded-full",
    md: "size-9 rounded-full",
    lg: "size-10 rounded-full",
  };

  const svgSizes = {
    sm: "size-4.5 stroke-[2.2]",
    md: "size-5 stroke-[2.2]",
    lg: "size-6 stroke-[2.2]",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const content = (
    <div className={cn("flex items-center gap-2.5 group shrink-0", className)}>
      <span
        className={cn(
          "grid place-items-center bg-gradient-to-tr from-[#e11d48] to-[#f43f5e] text-white shadow-md shadow-[#f43f5e]/25 transition-transform group-hover:scale-105 shrink-0",
          iconSizes[size]
        )}
      >
        <Pizza className={cn("text-white fill-white/20", svgSizes[size])} />
      </span>
      <div className="flex flex-col">
        <div className={cn("flex items-center font-bold tracking-tight leading-none text-foreground", textSizes[size])}>
          <span>Pizza</span>
          <span className="text-[#f43f5e]">Hub</span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] font-bold tracking-[0.22em] text-muted-foreground uppercase mt-0.5 leading-none">
            FRESH &amp; FAST
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
