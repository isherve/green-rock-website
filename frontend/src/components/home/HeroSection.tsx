"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertySearchBar } from "@/components/shared/PropertySearchBar";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { SITE_CONFIG, COMPANY_STATS } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { useResolvedSiteConfig, useSiteSettings } from "@/hooks/useSiteSettings";
import { STAT_KEYS } from "@/lib/i18n/translations";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
];

export function HeroSection() {
  const { t } = useLocale();
  const { data: settings } = useSiteSettings();
  const site = useResolvedSiteConfig(settings);

  return (
    <section className="relative overflow-hidden bg-[#f8faf9] dark:bg-slate-950 border-b border-border/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,92,69,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.06),transparent_50%)]" />

      <div className="container relative mx-auto px-4 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium text-primary mb-4 tracking-wide">
              {SITE_CONFIG.shortName} · {site.address}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-foreground leading-[1.08] mb-5 font-display">
              {t("heroTitle")}{" "}
              <span className="text-primary italic font-display">care</span>{" "}
              in Kigali.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
              {site.description} {site.architectureNote}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Button asChild size="lg" className="rounded-full px-7 shadow-sm">
                <Link href="/contact">
                  Request a quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-7 bg-white/80 dark:bg-slate-900/80">
                <Link href="/properties">{t("heroBrowseProperties")}</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border/70 max-w-2xl">
              {COMPANY_STATS.map((stat, index) => (
                <div key={stat.label}>
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-2xl lg:text-3xl font-bold text-foreground block"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t(STAT_KEYS[index])}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {HERO_IMAGES.map((src, index) => (
              <Link
                key={src}
                href={index === 0 ? "/properties" : index === 1 ? "/services" : "/materials"}
                className={`clean-card relative overflow-hidden group ${index === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white text-sm font-medium">
                  {index === 0 ? "Properties" : index === 1 ? "Construction" : "Materials"}
                </span>
              </Link>
            ))}
            <p className="col-span-2 text-center text-xs text-muted-foreground pt-1">
              Tap a frame to explore our services
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-12 max-w-4xl"
        >
          <p className="text-sm font-medium text-muted-foreground mb-3">{t("heroSearchLabel")}</p>
          <div className="clean-card p-2 sm:p-3 bg-white dark:bg-slate-900">
            <PropertySearchBar variant="compact" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
