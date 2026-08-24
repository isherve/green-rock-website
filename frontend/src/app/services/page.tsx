import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { fetchPublic, fetchPublicOne } from "@/lib/server-api";
import { getServerLocale } from "@/lib/server-locale";
import { localizeService } from "@/lib/i18n/content";
import { PAGE_HERO_IMAGES } from "@/lib/page-images";
import { MOCK_SERVICES } from "@/lib/mock-data";
import type { Service } from "@/types";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Services", description: "Comprehensive construction, real estate, and building materials services." };

export default async function ServicesPage() {
  const locale = await getServerLocale();
  const apiServices = await fetchPublic<Service>("/services", { limit: "50" });
  const services =
    apiServices.length > 0 ? apiServices : MOCK_SERVICES.map((s) => localizeService(s, locale));

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Architecture, construction, real estate, and building materials — professional solutions across Rwanda."
        image={PAGE_HERO_IMAGES.services}
      />
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="What We Offer" subtitle="Full-Service Solutions" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`}>
              <ServiceCard service={s} />
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/contact" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            Request a Custom Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
