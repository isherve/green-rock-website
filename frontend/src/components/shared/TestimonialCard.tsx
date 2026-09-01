"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

export function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="clean-card p-6 lg:p-7 relative h-full"
    >
      <Quote className="absolute top-6 right-6 h-7 w-7 text-primary/15" />

      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating ? "fill-secondary text-secondary" : "text-muted-foreground/25"
            }`}
          />
        ))}
      </div>

      <p className="text-foreground/90 leading-relaxed mb-6">&ldquo;{testimonial.content}&rdquo;</p>

      <div className="flex items-center gap-4 mt-auto">
        <div className="relative h-11 w-11 rounded-full overflow-hidden bg-primary/10 shrink-0">
          {testimonial.avatar ? (
            <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary font-semibold text-sm">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-sm">{testimonial.name}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-xs text-muted-foreground">
              {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
