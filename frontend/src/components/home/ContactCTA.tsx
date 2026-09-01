"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/shared/ContactForm";
import { useResolvedSiteConfig, useSiteSettings } from "@/hooks/useSiteSettings";
import { useLocale } from "@/hooks/useLocale";

export function ContactCTA() {
  const { t } = useLocale();
  const { data: settings } = useSiteSettings();
  const site = useResolvedSiteConfig(settings);

  return (
    <section className="page-section bg-[#f8faf9] dark:bg-slate-900/40 border-t border-border/60">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">{t("homeContactEyebrow")}</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight font-display">
              {t("homeContactTitle")}{" "}
              <span className="text-primary">{t("homeContactTitleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{t("homeContactDesc")}</p>

            <div className="space-y-3 mb-8">
              <a href={`tel:${site.phone}`} className="flex items-center gap-4 clean-card p-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("homeCallUs")}</p>
                  <p className="font-medium">{site.phone}</p>
                </div>
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-4 clean-card p-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("homeEmailUs")}</p>
                  <p className="font-medium">{site.email}</p>
                </div>
              </a>
            </div>

            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/contact">
                {t("homeVisitContact")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
