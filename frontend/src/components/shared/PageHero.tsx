import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function PageHero({
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
  breadcrumb,
}: PageHeroProps) {
  return (
    <section className="relative bg-dark">
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark/80" />
      <div className="container relative mx-auto px-4 py-14 md:py-20">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-white/60 mb-4 flex-wrap">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-secondary transition-colors">{item.label}</Link>
                ) : (
                  <span className="text-white/90">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 font-display">{title}</h1>
        {subtitle && <p className="text-white/75 text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
