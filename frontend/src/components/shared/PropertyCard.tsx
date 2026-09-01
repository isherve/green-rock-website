"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const imageUrl =
    property.images?.[0]?.url ??
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/properties/${property.slug}`} className="group clean-card overflow-hidden block h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={property.purpose === "SALE" ? "default" : "secondary"}>
              For {property.purpose === "RENT" ? "Rent" : "Sale"}
            </Badge>
            {property.featured && <Badge variant="warning">Featured</Badge>}
          </div>
        </div>

        <div className="p-5">
          <p className="text-xl font-bold text-primary mb-2">
            {formatPrice(property.price, property.currency)}
            {property.purpose === "RENT" && (
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            )}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {property.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-t border-border pt-4">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" /> {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" /> {property.bathrooms} Baths
              </span>
            )}
            {property.area != null && (
              <span className="flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" /> {property.area} {property.areaUnit}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mt-4 group-hover:gap-3 transition-all">
            View property <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
