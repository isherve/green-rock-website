"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { Button } from "@/components/ui/button";
import { usePublicList } from "@/hooks/usePublicData";
import { useLocale } from "@/hooks/useLocale";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { localizeProperty } from "@/lib/i18n/content";
import type { Property } from "@/types";

export function PropertiesSection() {
  const { t } = useLocale();
  const { data: properties = [] } = usePublicList<Property>(
    "/properties",
    { limit: "6", featured: "true" },
    MOCK_PROPERTIES,
    localizeProperty
  );
  const featured = properties.slice(0, 3);

  return (
    <section className="page-section bg-[#f8faf9] dark:bg-slate-900/40">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="Featured listings" title={t("homeFeaturedTitle")} align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {featured.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/properties">{t("homeViewAllProperties")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
