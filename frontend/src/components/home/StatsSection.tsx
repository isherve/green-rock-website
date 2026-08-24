"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { COMPANY_STATS } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { STAT_KEYS } from "@/lib/i18n/translations";

export function StatsSection() {
  const { t } = useLocale();

  return (
    <section className="py-16 lg:py-20 bg-primary relative overflow-hidden perspective-[1200px]">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-secondary blur-3xl animate-float-y" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container relative mx-auto px-4">
        <SectionHeading
          subtitle={t("homeStatsSubtitle")}
          title={t("homeStatsTitle")}
          description={t("homeStatsDesc")}
          className="[&_h2]:text-white [&_p]:text-white/70 [&_span]:text-secondary"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {COMPANY_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center motion-3d glass-3d rounded-2xl py-8 px-4 border border-white/10"
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                className="text-4xl lg:text-5xl font-bold text-white block mb-2"
              />
              <p className="text-sm text-white/70 font-medium">{t(STAT_KEYS[index])}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
