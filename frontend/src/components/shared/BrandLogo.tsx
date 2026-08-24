import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { LogoMark } from "@/components/shared/LogoMark";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "onDark";
  className?: string;
}

const sizes = {
  sm: "h-10 w-10",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export function BrandLogo({ size = "md", showText = true, variant = "default", className }: BrandLogoProps) {
  const onDark = variant === "onDark";

  return (
    <Link href="/" className={cn("flex items-center gap-3 group shrink-0", className)}>
      <span
        className={cn(
          sizes[size],
          "rounded-full ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all overflow-hidden inline-flex bg-white"
        )}
      >
        <LogoMark className="h-full w-full" />
      </span>
      {showText && (
        <div className="hidden sm:block">
          <span
            className={cn(
              "font-bold text-lg leading-tight block font-display",
              onDark ? "text-white" : "text-slate-900 dark:text-white"
            )}
          >
            Green Rock
          </span>
          <span className={cn("text-xs tracking-wide", onDark ? "text-white/70" : "text-slate-600 dark:text-white/70")}>
            General Supply Ltd
          </span>
        </div>
      )}
    </Link>
  );
}
