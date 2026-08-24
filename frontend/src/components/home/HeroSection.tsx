"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertySearchBar } from "@/components/shared/PropertySearchBar";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { SITE_CONFIG } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { useRef } from "react";

const HeroScene3D = dynamic(
  () => import("@/components/3d/HeroScene3D").then((m) => m.HeroScene3D),
  { ssr: false, loading: () => null }
);

export function HeroSection() {
  const { t } = useLocale();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-end pb-12 lg:pb-16 overflow-hidden bg-dark perspective-[1200px]">
      <div className="absolute inset-0">
        <HeroScene3D />
      </div>

      <FloatingOrbs />
      <div className="absolute inset-0 bg-gradient-to-b from-dark/25 via-dark/45 to-dark/80 pointer-events-none" />

      <motion.div style={{ y, opacity }} className="container relative z-10 mx-auto px-4 w-full pt-32">
        <div className="max-w-4xl mb-10 lg:mb-14 motion-3d">
          <motion.p
            initial={{ opacity: 0, z: -40, rotateX: 20 }}
            animate={{ opacity: 1, z: 0, rotateX: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-secondary font-semibold text-sm uppercase tracking-[0.25em] mb-4"
            style={{ transformStyle: "preserve-3d" }}
          >
            {t("heroEyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40, rotateX: 25 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-5 font-display"
            style={{ transformStyle: "preserve-3d", textShadow: "0 8px 32px rgba(0,0,0,0.35)" }}
          >
            {t("heroTitle")}{" "}
            <span className="text-gradient-3d">{SITE_CONFIG.shortName}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.65 }}
            className="text-lg text-white/85 max-w-2xl leading-relaxed mb-6"
          >
            {t("siteDescription")} {t("architectureNote")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="rounded-lg shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
              <Link href="/properties">
                {t("heroBrowseProperties")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg border-white/40 text-white bg-white/10 hover:bg-white hover:text-dark backdrop-blur-sm">
              <Link href="/contact">{t("heroListProperty")}</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.42, duration: 0.7 }}
          className="max-w-5xl glass-3d rounded-2xl p-1"
          style={{ transformStyle: "preserve-3d" }}
        >
          <p className="text-white/90 font-medium mb-3 text-sm uppercase tracking-wider px-2">{t("heroSearchLabel")}</p>
          <PropertySearchBar variant="hero" />
        </motion.div>
      </motion.div>
    </section>
  );
}
