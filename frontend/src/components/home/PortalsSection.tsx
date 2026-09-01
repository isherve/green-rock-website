"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/hooks/useLocale";

const PORTAL_CONFIG = [
  {
    titleKey: "homePortalCustomerTitle",
    descKey: "homePortalCustomerDesc",
    href: "/portal/login",
    registerHref: "/portal/register",
    icon: UserCircle,
    featureKeys: ["homePortalFeature1", "homePortalFeature2", "homePortalFeature3"],
  },
  {
    titleKey: "homePortalAdminTitle",
    descKey: "homePortalAdminDesc",
    href: "/admin/login",
    icon: Shield,
    featureKeys: ["homePortalFeature4", "homePortalFeature5", "homePortalFeature6"],
  },
] as const;

export function PortalsSection() {
  const { t } = useLocale();

  return (
    <section className="page-section bg-[#f8faf9] dark:bg-slate-900/40">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle={t("homePortalsSubtitle")}
          title={t("homePortalsTitle")}
          description={t("homePortalsDesc")}
          align="center"
        />
        <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
          {PORTAL_CONFIG.map((portal, index) => (
            <motion.div
              key={portal.titleKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="clean-card p-7 flex flex-col h-full"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <portal.icon className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-semibold mb-2">{t(portal.titleKey)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{t(portal.descKey)}</p>
              <ul className="text-sm text-muted-foreground space-y-1.5 mb-6">
                {portal.featureKeys.map((key) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="flex-1 rounded-full">
                  <Link href={portal.href}>
                    {t("homeSignIn")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {"registerHref" in portal && portal.registerHref && (
                  <Button asChild variant="outline" className="flex-1 rounded-full">
                    <Link href={portal.registerHref}>{t("homeRegister")}</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
