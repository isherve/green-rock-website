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
    <section className="page-section bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle="Browse by category"
          title="Find the right property or supply"
          description={t("homeCatDesc")}
          align="center"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {HOME_CATEGORY_KEYS.map((cat, index) => (
            <motion.div
              key={cat.titleKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <Link href={cat.href} className="group clean-card overflow-hidden block h-full">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={t(cat.titleKey)}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute top-3 left-3 text-[11px] font-medium uppercase tracking-wider text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    Featured
                  </span>
                  <h3 className="absolute bottom-3 left-3 right-3 text-white font-semibold leading-snug">
                    {t(cat.titleKey)}
                  </h3>
                </div>
                <div className="p-4 flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{t(cat.descKey)}</p>
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
