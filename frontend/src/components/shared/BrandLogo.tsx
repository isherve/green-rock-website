import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  /** Hide when false — the PNG already includes the company name */
  showText?: boolean;
  variant?: "default" | "onDark";
  className?: string;
}

const logoSizes = {
  sm: { height: 36, maxWidth: 120, className: "h-9 max-w-[120px]" },
  md: { height: 44, maxWidth: 148, className: "h-11 max-w-[148px]" },
  lg: { height: 64, maxWidth: 200, className: "h-16 max-w-[200px]" },
};

export function BrandLogo({
  size = "md",
  showText = false,
  variant = "default",
  className,
}: BrandLogoProps) {
  const onDark = variant === "onDark";
  const dims = logoSizes[size];

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3 group shrink-0 min-w-0", className)}
      aria-label={SITE_CONFIG.name}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center shrink-0 rounded-lg bg-white p-0.5",
          "ring-1 ring-black/5 group-hover:ring-primary/30 transition-shadow",
          onDark && "shadow-sm"
        )}
      >
        <Image
          src={SITE_CONFIG.logo}
          alt={SITE_CONFIG.name}
          width={864}
          height={864}
          priority
          className={cn(dims.className, "w-auto object-contain object-center")}
        />
      </span>
      {showText && (
        <div className="hidden sm:block min-w-0">
          <span
            className={cn(
              "font-bold text-lg leading-tight block font-display truncate",
              onDark ? "text-white" : "text-slate-900 dark:text-white"
            )}
          >
            Green Rock
          </span>
          <span
            className={cn(
              "text-xs tracking-wide truncate block",
              onDark ? "text-white/70" : "text-slate-600 dark:text-white/70"
            )}
          >
            General Supply Ltd
          </span>
        </div>
      )}
    </Link>
  );
}
