"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getServiceImage } from "@/lib/service-images";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const imageUrl = getServiceImage(service);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/services/${service.slug}`} className="group clean-card overflow-hidden block h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={service.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            Service
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{service.description}</p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            View experience <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
