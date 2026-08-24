"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, HardHat, Shield, ArrowRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TiltCard3D } from "@/components/motion/TiltCard3D";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { useLocale } from "@/hooks/useLocale";

const PORTAL_CONFIG = [
  {
    titleKey: "homePortalCustomerTitle",
    descKey: "homePortalCustomerDesc",
    href: "/portal/login",
    registerHref: "/portal/register",
    icon: UserCircle,
    color: "bg-primary/10 text-primary",
    featureKeys: ["homePortalFeature1", "homePortalFeature2", "homePortalFeature3"],
  },
  {
    titleKey: "homePortalAdminTitle",
    descKey: "homePortalAdminDesc",
    href: "/admin/login",
    icon: Shield,
    color: "bg-dark/10 text-dark",
    featureKeys: ["homePortalFeature4", "homePortalFeature5", "homePortalFeature6"],
  },
] as const;

export function PortalsSection() {
  const { t } = useLocale();

  return (
    <section className="py-20 lg:py-28 section-padding bg-accent/40 relative overflow-hidden">
      <FloatingOrbs />
      <div className="container relative mx-auto px-4">
        <SectionHeading
          subtitle={t("homePortalsSubtitle")}
          title={t("homePortalsTitle")}
          description={t("homePortalsDesc")}
          align="center"
        />
        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
          {PORTAL_CONFIG.map((portal, index) => (
            <motion.div
              key={portal.titleKey}
              initial={{ opacity: 0, y: 40, rotateX: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="motion-3d"
            >
              <TiltCard3D className="pro-card p-8 flex flex-col h-full">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${portal.color} mb-5 animate-float-y`}>
                  <portal.icon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold font-display mb-2">{t(portal.titleKey)}</h3>
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
                  <Button asChild className="flex-1">
                    <Link href={portal.href}>
                      {t("homeSignIn")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {"registerHref" in portal && portal.registerHref && (
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={portal.registerHref}>{t("homeRegister")}</Link>
                    </Button>
                  )}
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> {t("homePortalTag1")}</span>
          <span className="inline-flex items-center gap-2"><HardHat className="h-4 w-4 text-primary" /> {t("homePortalTag2")}</span>
        </div>
      </div>
    </section>
  );
}
