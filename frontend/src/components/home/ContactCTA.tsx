"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/shared/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";

export function ContactCTA() {
  const { t } = useLocale();

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
              {t("homeContactEyebrow")}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight font-display">
              {t("homeContactTitle")}{" "}
              <span className="text-primary">{t("homeContactTitleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t("homeContactDesc")}
            </p>

            <div className="space-y-4 mb-8">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="flex items-center gap-4 pro-card p-4 hover:-translate-y-0.5 transition-transform group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("homeCallUs")}</p>
                  <p className="font-semibold">{SITE_CONFIG.phone}</p>
                </div>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-4 pro-card p-4 hover:-translate-y-0.5 transition-transform group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("homeEmailUs")}</p>
                  <p className="font-semibold">{SITE_CONFIG.email}</p>
                </div>
              </a>
            </div>

            <Button asChild variant="outline" size="lg">
              <Link href="/contact">
                {t("homeVisitContact")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
