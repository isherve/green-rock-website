import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "onDark";
  className?: string;
}

const sizes = {
  sm: { img: 40, className: "h-10 w-10" },
  md: { img: 48, className: "h-11 w-11" },
  lg: { img: 56, className: "h-14 w-14" },
};

export function BrandLogo({ size = "md", showText = true, variant = "default", className }: BrandLogoProps) {
  const s = sizes[size];
  const onDark = variant === "onDark";

  return (
    <Link href="/" className={cn("flex items-center gap-3 group shrink-0", className)}>
      <Image
        src={SITE_CONFIG.logo}
        alt={`${SITE_CONFIG.name} logo`}
        width={s.img}
        height={s.img}
        className={cn(
          s.className,
          "rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all bg-white"
        )}
        priority
      />
      {showText && (
        <div className="hidden sm:block">
          <span className={cn("font-bold text-lg leading-tight block font-display", onDark ? "text-white" : "text-foreground")}>
            Green Rock
          </span>
          <span className={cn("text-xs tracking-wide", onDark ? "text-white/60" : "text-muted-foreground")}>
            General Supply Ltd
          </span>
        </div>
      )}
    </Link>
  );
}
