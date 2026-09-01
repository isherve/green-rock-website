"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Award, Clock, Users, Truck, PenTool, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { WHY_CHOOSE_KEYS } from "@/lib/i18n/translations";

const REASON_ICONS = [Shield, Award, Clock, Users, PenTool, Truck];

export function WhyChooseUs() {
  const { t } = useLocale();

  return (
    <>
      <section className="page-section bg-[#f8faf9] dark:bg-slate-900/40">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <div>
              <SectionHeading
                subtitle="Our philosophy"
                title="The journey of perfect builds"
                description="Every project tells a story. At Green Rock, we combine Rwandan expertise with professional standards, from property listings and construction to materials delivered on site."
                align="left"
                className="mb-0"
              />
              <Button asChild variant="outline" className="mt-8 rounded-full">
                <Link href="/about">
                  Learn our story
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {WHY_CHOOSE_KEYS.slice(0, 4).map((reason, index) => {
                const Icon = REASON_ICONS[index];
                return (
                  <motion.div
                    key={reason.titleKey}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="clean-card p-5"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Service</p>
                    <h3 className="font-semibold mb-2">{t(reason.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(reason.descKey)}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-16 border-y border-border bg-white dark:bg-slate-950">
        <div className="quote-block">
          <p className="text-2xl lg:text-3xl font-display font-medium text-foreground leading-snug italic">
            &ldquo;Quality in every detail, trust in every delivery.&rdquo;
          </p>
          <p className="text-sm text-muted-foreground mt-4">{SITE_CONFIG.name}</p>
        </div>
      </section>
    </>
  );
}
