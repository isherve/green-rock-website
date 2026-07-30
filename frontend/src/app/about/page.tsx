import { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
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
      <section className="py-20 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading title="Our Story" subtitle="Company History" />
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in {SITE_CONFIG.founded}, {SITE_CONFIG.name} has grown from a small construction firm into one of Rwanda&apos;s most trusted diversified companies. We specialize in real estate, construction, building materials, interior design, and timber sales.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {SITE_CONFIG.architectureNote}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our commitment to quality, innovation, and customer satisfaction has earned us the trust of hundreds of clients across Rwanda and beyond.
            </p>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" alt="Our team at work" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div className="pro-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
            <p className="text-muted-foreground">To be East Africa&apos;s leading integrated construction and real estate company, setting the standard for quality and innovation.</p>
          </div>
          <div className="pro-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
            <p className="text-muted-foreground">To deliver exceptional construction solutions, premium properties, and quality building materials while creating lasting value for our clients and communities.</p>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Core Values" subtitle="What Drives Us" align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {VALUES.map((v) => (
            <div key={v.title} className="text-center p-6 rounded-2xl border hover:shadow-lg transition-shadow">
              <v.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">{v.title}</h4>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="team" className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Team" subtitle="Leadership" align="center" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {TEAM.map((m) => (
              <div key={m.name} className="text-center group">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-primary/20 group-hover:ring-primary transition-all">
                  <Image src={m.image} alt={m.name} fill className="object-cover" />
                </div>
                <h4 className="font-semibold text-lg">{m.name}</h4>
                <p className="text-primary text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnersSection />

      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Our Journey" subtitle="Timeline" align="center" />
        <div className="max-w-2xl mx-auto mt-12 space-y-6">
          {TIMELINE.map((t) => (
            <div key={t.year} className="flex gap-6 items-start">
              <span className="text-secondary font-bold text-lg w-16 shrink-0">{t.year}</span>
              <div className="flex-1 pb-6 border-l-2 border-primary/30 pl-6">{t.event}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
