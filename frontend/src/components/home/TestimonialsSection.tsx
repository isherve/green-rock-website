"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { usePublicList } from "@/hooks/usePublicData";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import type { Testimonial } from "@/types";

export function TestimonialsSection() {
  const { data: testimonials = [] } = usePublicList<Testimonial>("/testimonials", { limit: "6", featured: "true" }, MOCK_TESTIMONIALS);

  return (
    <section className="py-20 lg:py-28 section-padding bg-dark text-white">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="Client Reviews" title="What Our Clients Say" align="center" className="[&_h2]:text-white [&_p]:text-white/70" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
