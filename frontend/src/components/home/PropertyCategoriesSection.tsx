"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const CATEGORIES = [
  {
    title: "Residential Houses",
    description: "Villas, homes & townhouses for sale or rent",
    href: "/properties?type=HOUSE",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
  {
    title: "Residential Apartments",
    description: "Flats & luxury apartment units",
    href: "/properties?type=APARTMENT",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  },
  {
    title: "Plots of Land",
    description: "Residential & commercial land across Rwanda",
    href: "/properties?type=LAND",
    image: "https://images.unsplash.com/photo-1500382017468-90403fed87ef?w=600&q=80",
  },
  {
    title: "Commercial Property",
    description: "Offices, shops & business spaces",
    href: "/properties?type=COMMERCIAL",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
  },
  {
    title: "Joint Venture",
    description: "Partner on prime development opportunities",
    href: "/contact?type=PROPERTY",
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=600&q=80",
  },
  {
    title: "Off-Plan Properties",
    description: "Pre-construction & investment listings",
    href: "/contact?type=PROPERTY",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
  },
  {
    title: "Co-Listing",
    description: "List your property with Green Rock agents",
    href: "/contact?type=PROPERTY",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
  },
  {
    title: "Building Materials",
    description: "Cement, steel, tiles & site delivery",
    href: "/materials",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
  },
];

export function PropertyCategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle="Browse by Category"
          title="Property Categories"
          description="From residential homes and land to joint ventures, off-plan investments, and co-listing."
          align="center"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={cat.href}
                className="group pro-card overflow-hidden block h-full hover:-translate-y-1 transition-transform"
              >
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/25 to-transparent" />
                  <h3 className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold font-display leading-snug uppercase tracking-wide">
                    {cat.title}
                  </h3>
                </div>
                <div className="p-4 flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
