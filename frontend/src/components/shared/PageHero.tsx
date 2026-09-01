import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}

export function PageHero({
  title,
  subtitle,
  eyebrow = "Green Rock · Kigali",
  breadcrumb,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/60 bg-[#f8faf9] dark:bg-slate-950",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,92,69,0.07),transparent_55%)]" />
      <div className="container relative mx-auto px-4 py-12 md:py-16 lg:py-20">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-5 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground/80">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <p className="text-sm font-medium text-primary mb-3 tracking-wide">{eyebrow}</p>
        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-4 font-display leading-[1.1] max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
