"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/hooks/useLocale";
import { HOME_CATEGORY_KEYS } from "@/lib/i18n/translations";

export function PropertyCategoriesSection() {
  const { t } = useLocale();

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle={t("homeCatSubtitle")}
          title={t("homeCatTitle")}
          description={t("homeCatDesc")}
          align="center"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOME_CATEGORY_KEYS.map((cat, index) => (
            <motion.div
              key={cat.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={cat.href}
                className="group pro-card overflow-hidden block h-full hover:-translate-y-1 transition-transform bg-white dark:bg-slate-900"
              >
                <div className="relative h-40 overflow-hidden bg-slate-800">
                  <Image
                    src={cat.image}
                    alt={t(cat.titleKey)}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                  <h3 className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold font-display leading-snug uppercase tracking-wide">
                    {t(cat.titleKey)}
                  </h3>
                </div>
                <div className="p-4 flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{t(cat.descKey)}</p>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
