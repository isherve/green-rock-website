import { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { PageSection } from "@/components/shared/PageSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TEAM } from "@/lib/mock-data";
import { SITE_CONFIG } from "@/lib/constants";
import { PartnersSection } from "@/components/home/PartnersSection";
import { Award, Eye, Target, Heart } from "lucide-react";

export const metadata: Metadata = { title: "About Us", description: "Learn about Green Rock General Supply Ltd - our history, vision, mission and team." };

const VALUES = [
  { icon: Target, title: "Excellence", desc: "We deliver the highest quality in every project." },
  { icon: Heart, title: "Integrity", desc: "Honest, transparent dealings with all stakeholders." },
  { icon: Eye, title: "Innovation", desc: "Modern solutions for modern construction challenges." },
  { icon: Award, title: "Reliability", desc: "On-time delivery and dependable service." },
];

const TIMELINE = [
  { year: "2010", event: "Company founded in Kigali" },
  { year: "2014", event: "Expanded into real estate services" },
  { year: "2018", event: "Launched building materials division" },
  { year: "2022", event: "Completed 200+ construction projects" },
  { year: "2026", event: "Leading diversified supply company in Rwanda" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" subtitle="Building Rwanda's future since 2010" />
      <PageSection>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading title="Our Story" subtitle="Company History" align="left" className="mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in {SITE_CONFIG.founded}, {SITE_CONFIG.name} has grown from a small construction firm into one of Rwanda&apos;s most trusted diversified companies. We specialize in real estate, construction, building materials, interior design, and timber sales.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">{SITE_CONFIG.architectureNote}</p>
            <p className="text-muted-foreground leading-relaxed">
              Our commitment to quality, innovation, and customer satisfaction has earned us the trust of hundreds of clients across Rwanda and beyond.
            </p>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden clean-card">
            <Image src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" alt="Our team at work" fill className="object-cover" />
          </div>
        </div>
      </PageSection>

      <PageSection muted>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="clean-card p-8">
            <h3 className="text-2xl font-bold text-primary mb-4 font-display">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">To be East Africa&apos;s leading integrated construction and real estate company, setting the standard for quality and innovation.</p>
          </div>
          <div className="clean-card p-8">
            <h3 className="text-2xl font-bold text-primary mb-4 font-display">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">To deliver exceptional construction solutions, premium properties, and quality building materials while creating lasting value for our clients and communities.</p>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading title="Core Values" subtitle="What Drives Us" align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {VALUES.map((v) => (
            <div key={v.title} className="clean-card text-center p-6">
              <v.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">{v.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection muted id="team">
        <SectionHeading title="Our Team" subtitle="Leadership" align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {TEAM.map((m) => (
            <div key={m.name} className="text-center group">
              <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden mb-4 ring-2 ring-primary/15 group-hover:ring-primary/40 transition-all clean-card">
                <Image src={m.image} alt={m.name} fill className="object-cover" />
              </div>
              <h4 className="font-semibold text-lg">{m.name}</h4>
              <p className="text-primary text-sm">{m.role}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PartnersSection />

      <PageSection>
        <SectionHeading title="Our Journey" subtitle="Timeline" align="center" />
        <div className="max-w-2xl mx-auto mt-10 space-y-4">
          {TIMELINE.map((t) => (
            <div key={t.year} className="flex gap-6 items-start clean-card p-4">
              <span className="text-primary font-bold text-lg w-16 shrink-0">{t.year}</span>
              <p className="flex-1 text-muted-foreground leading-relaxed">{t.event}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
