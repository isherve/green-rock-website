"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Award,
  Clock,
  Users,
  Truck,
  PenTool,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TiltCard3D } from "@/components/motion/TiltCard3D";
import { useLocale } from "@/hooks/useLocale";
import { WHY_CHOOSE_KEYS } from "@/lib/i18n/translations";

const REASON_ICONS = [Shield, Award, Clock, Users, PenTool, Truck];

export function WhyChooseUs() {
  const { t } = useLocale();

  return (
    <section className="py-20 lg:py-28 section-padding">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle={t("homeWhySubtitle")}
          title={t("homeWhyTitle")}
          description={t("homeWhyDesc")}
          align="center"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {WHY_CHOOSE_KEYS.map((reason, index) => {
            const Icon = REASON_ICONS[index];
            return (
              <motion.div
                key={reason.titleKey}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <TiltCard3D className="pro-card p-6 lg:p-8 h-full">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-bold font-display mb-2">{t(reason.titleKey)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(reason.descKey)}</p>
                </TiltCard3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
