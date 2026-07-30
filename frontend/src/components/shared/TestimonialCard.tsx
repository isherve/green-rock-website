"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

export function TestimonialCard({
  testimonial,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="pro-card p-6 lg:p-8 relative bg-white/5 border-white/10 backdrop-blur-sm"
    >
      <Quote className="absolute top-6 right-6 h-8 w-8 text-secondary/30" />

      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating
                ? "fill-secondary text-secondary"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      <p className="text-foreground/90 leading-relaxed mb-6 italic">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-primary/10 shrink-0">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary font-bold">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-sm">{testimonial.name}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-xs text-muted-foreground">
              {[testimonial.role, testimonial.company]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
