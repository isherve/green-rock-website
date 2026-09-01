"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { usePublicList } from "@/hooks/usePublicData";
import { useLocale } from "@/hooks/useLocale";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { localizeService } from "@/lib/i18n/content";
import type { Service } from "@/types";

export function ServicesSection() {
  const { t } = useLocale();
  const { data: services = [] } = usePublicList<Service>(
    "/services",
    { limit: "6", featured: "true" },
    MOCK_SERVICES,
    localizeService
  );
  const featured = services.filter((s) => s.featured).slice(0, 6).length ? services.filter((s) => s.featured).slice(0, 6) : services.slice(0, 6);

  return (
    <section className="page-section bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="What we offer" title="A selection of exceptional services" description={t("homeServicesDesc")} align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {featured.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/services">{t("homeExploreServices")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
