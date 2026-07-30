"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { usePublicList } from "@/hooks/usePublicData";
import { MOCK_SERVICES } from "@/lib/mock-data";
import type { Service } from "@/types";

export function ServicesSection() {
  const { data: services = [] } = usePublicList<Service>("/services", { limit: "6", featured: "true" }, MOCK_SERVICES);
  const featured = services.filter((s) => s.featured).slice(0, 6).length ? services.filter((s) => s.featured).slice(0, 6) : services.slice(0, 6);

  return (
    <section className="py-20 lg:py-28 section-padding">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="What We Do" title="Our Services" description="Comprehensive solutions for construction, real estate, and building materials." align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {featured.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/services">Explore All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
