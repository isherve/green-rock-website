"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { usePublicList } from "@/hooks/usePublicData";
import { MOCK_PARTNERS } from "@/lib/mock-data";
import type { Partner } from "@/types";

export function PartnersSection() {
  const { data: partners = [] } = usePublicList<Partner>("/partners", { limit: "12" }, MOCK_PARTNERS);

  if (partners.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 section-padding" id="partners">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle="Partnerships"
          title="Trusted By Industry Leaders"
          description="We collaborate with leading organizations to deliver world-class results."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="pro-card p-4 flex items-center justify-center h-24 grayscale hover:grayscale-0 transition-all duration-300"
            >
              {partner.website ? (
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="relative w-full h-12">
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain" sizes="150px" />
                </a>
              ) : (
                <div className="relative w-full h-12">
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain" sizes="150px" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
