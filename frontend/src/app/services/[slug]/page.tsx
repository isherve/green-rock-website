import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { fetchPublicOne } from "@/lib/server-api";
import { getServerLocale } from "@/lib/server-locale";
import { localizeService } from "@/lib/i18n/content";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { getServiceImage } from "@/lib/service-images";
import { ContactForm } from "@/components/shared/ContactForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Service } from "@/types";

type Props = { params: Promise<{ slug: string }> };

const DETAILS: Record<string, string[]> = {
  architecture: ["House drawings & floor plans", "Architectural design & 3D concepts", "Detailed construction quotations", "Building permits documentation support"],
  "real-estate": ["Buying land & houses", "Selling property", "Property valuation", "Property listings & search"],
  construction: ["Residential construction", "Commercial buildings", "Infrastructure projects", "Project supervision"],
  "building-materials": ["Cement, bricks & steel", "Tiles & roofing", "Plumbing & electrical", "Delivery service"],
  "interior-design": ["Residential interiors", "Office design", "Commercial spaces", "Custom furniture"],
  painting: ["Interior painting", "Exterior painting", "Industrial coating", "Decorative finishes"],
  timber: ["Timber sales", "Wood processing", "Wood construction", "Custom carpentry"],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const apiService = await fetchPublicOne<Service>(`/services/${slug}`);
  const mock = MOCK_SERVICES.find((s) => s.slug === slug);
  const service = apiService ?? (mock ? localizeService(mock, locale) : null);
  return { title: service?.title, description: service?.description };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const apiService = await fetchPublicOne<Service>(`/services/${slug}`);
  const mock = MOCK_SERVICES.find((s) => s.slug === slug);
  const service = apiService ?? (mock ? localizeService(mock, locale) : null);
  if (!service) notFound();

  return (
    <>
      <PageHero title={service.title} subtitle={service.description} image={getServiceImage(service)} />
      <section className="py-20 container mx-auto px-4">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/services"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Services</Link>
        </Button>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Service Overview</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{service.description}</p>
            <ul className="space-y-3">
              {(DETAILS[slug] || ["Professional consultation", "Quality delivery", "Expert team", "Competitive pricing"]).map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="pro-card p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-6">Request a Quote</h3>
            <ContactForm defaultType="QUOTE" />
          </div>
        </div>
      </section>
    </>
  );
}
