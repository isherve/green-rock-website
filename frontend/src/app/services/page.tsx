import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { fetchPublic, withFallback } from "@/lib/server-api";
import { MOCK_SERVICES } from "@/lib/mock-data";
import type { Service } from "@/types";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Services", description: "Comprehensive construction, real estate, and building materials services." };

export default async function ServicesPage() {
  const services = withFallback(await fetchPublic<Service>("/services", { limit: "50" }), MOCK_SERVICES);

  return (
    <>
      <PageHero title="Our Services" subtitle="Professional solutions for every need" image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80" />
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
