"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TiltCard3D } from "@/components/motion/TiltCard3D";
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
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="motion-3d"
    >
      <TiltCard3D className="group pro-card overflow-hidden h-full">
      <Link href={`/services/${service.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imageUrl}
            alt={service.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
          {service.icon && (
            <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white text-xl shadow-lg">
              {service.icon}
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
            {service.description}
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
            Learn More <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
      </TiltCard3D>
    </motion.article>
  );
}
